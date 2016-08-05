import Ember from "ember";

const {
    inject: { service },
    Logger: { debug },
    computed: { alias },
    run: { scheduleOnce },
    run,
    observer,
    on,
    get,
    set,
    getProperties,
    RSVP: { allSettled, resolve, reject },
    Object: EmberObject,
    Service,
    Evented,
} = Ember;

export default Service.extend(Evented, {
    // Events
    // syncStarted: synchronization started
    // syncCompleted: synchronization completed
    // conflict: conflict found

    store: service(),
    onlineStore: service(),
    connection: service(),
    syncQueue: service(),

    eventListeners: null,

    isOnline: alias("connection.isOnline"),
    isOnlineStateDidChange: on("init", observer("isOnline", function () {
        const isOnline = get(this, "isOnline");

        if (isOnline) {
            this.syncOnline();
        } else {
            this._removeAllListeners();
        }
    })),

    init() {
        this._super(...arguments);
        set(this, "eventListeners", EmberObject.create({}));
    },

    syncOnline() {
        debug("Syncer: Starting online full sync");
        set(this, "isSyncing", true);
        this.trigger("syncStarted");
        return this._reloadOnlineStore()
            .then(this._flushSyncQueue.bind(this))
            .then(this._updateOfflineStore.bind(this))
            .finally(() => {
                debug("Syncer: Full sync has been completed");
                set(this, "isSyncing", false);
                this.trigger("syncCompleted");
            });
    },

    pushEventOffline(onlineEvent) {
        debug(`Syncer: Syncing online event ${get(onlineEvent, "name")} into offline store`);

        return this._pushToStore(get(this, "store"), onlineEvent);
    },

    pushEventOnline(offlineEvent) {
        return this._pushToStore(get(this, "onlineStore"), offlineEvent).then((onlineEvent) => {
            set(offlineEvent, "isOffline", false);
            this._listenForChanges(onlineEvent);
            return offlineEvent.save();
        });
    },

    _reloadOnlineStore() {
        get(this, "onlineStore").unloadAll();
        this._removeAllListeners();

        return get(this, "store")
            .findAll("event")
            .then(events => events.map(this._fetchOnlineEvent.bind(this)))
            .then(fetchOperations => allSettled(fetchOperations));
    },

    _flushSyncQueue() {
        return get(this, "syncQueue").flush();
    },

    _updateOfflineStore() {
        debug("Syncer: Updating Offline Store");

        return get(this, "store")
            .findAll("event")
            .then(events => events.rejectBy("isOffline", true))
            .then(events => events.map(this._replaceOfflineEvent.bind(this)))
            .then(operations => allSettled(operations));
    },

    _fetchOnlineEvent(offlineEvent) {
        const { id, isOffline } = getProperties(offlineEvent, "id", "isOffline");

        if (isOffline) {
            return resolve();
        }

        this._unloadOnlineEvent(id);

        return get(this, "onlineStore")
            .findRecord("event", id)
            .catch(this._onlineEventNotFound.bind(this, offlineEvent));
    },

    _replaceOfflineEvent(offlineEvent) {
        return get(this, "onlineStore")
            .findRecord("event", get(offlineEvent, "id"))
            .then((onlineEvent) => {
                this.pushEventOffline(onlineEvent);
                this._listenForChanges(onlineEvent);
            });
    },

    _syncOneEvent(offlineEvent) {
        this._fetchOnlineEvent(offlineEvent).then(() => {
            this._replaceOfflineEvent(offlineEvent);
        }).catch(() => { });
    },

    _onlineEventNotFound(offlineEvent, error) {
        const { id, name } = getProperties(offlineEvent, "id", "name");

        debug(`Syncer: Event ${name} not found online`);
        debug("Syncer: Setting event as offline - it will be available to manual sync");
        set(offlineEvent, "isOffline", true);
        this._removeListenerFor(id);
        this.trigger("conflict", {
            modelName: "event",
            type: "not-found-online",
            model: {
                id,
                name,
            },
        });

        return offlineEvent.save().then(() => reject(error));
    },

    _pushToStore(store, model) {
        const normalized = this._normalizeModel(model);

        return store.push(normalized).save();
    },

    _normalizeModel(model) {
        const store = get(this, "store");
        const snapshot = model._createSnapshot();
        const serializer = store.serializerFor(snapshot.modelName);
        const serialized = serializer.serialize(snapshot, { includeId: true });

        return store.normalize(snapshot.modelName, serialized);
    },

    _unloadOnlineEvent(id) {
        const event = get(this, "onlineStore").peekRecord("event", id);

        if (event) {
            get(this, "onlineStore").unloadRecord(event);
            this._removeListenerFor(id);
        }
    },

    // workaround to keep firebase realtime function
    _listenForChanges(onlineEvent) {
        const eventListeners = get(this, "eventListeners");
        const eventId = get(onlineEvent, "id");
        let isInitial = true;

        if (!eventListeners[eventId]) {
            const ref = onlineEvent.ref();

            onlineEvent.ref().on("value", (snapshot) => {
                run(() => {
                    // don't listen for initial on value
                    if (isInitial) {
                        isInitial = false;
                        return;
                    }
                    if (get(this, "isSyncing") || get(this, "syncQueue.isProcessing")) {
                        return;
                    }

                    const onlineEventId = snapshot.key;

                    // some changes in firebase not coming from this application instance
                    // schedule sync
                    scheduleOnce("actions", () => {
                        get(this, "store")
                            .findRecord("event", onlineEventId)
                            .then(this._syncOneEvent.bind(this));
                    });
                });
            });
            eventListeners[eventId] = ref;
            set(this, "eventListeners", eventListeners);
        }
    },

    _removeAllListeners() {
        Object.keys(get(this, "eventListeners")).forEach(this._removeListenerFor.bind(this));
    },

    _removeListenerFor(eventId) {
        const eventListeners = get(this, "eventListeners");
        const ref = eventListeners[eventId];

        if (ref) {
            ref.off("value");
            delete eventListeners[eventId];
        }
    },
});
