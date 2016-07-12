import Ember from "ember";

const {
    inject: { service },
    Logger: { debug },
    computed: { alias },
    observer,
    on,
} = Ember;

export default Ember.Service.extend(Ember.Evented, {
    store: service(),
    onlineStore: service(),
    connection: service(),
    syncQueue: service(),

    eventListeners: null,

    isOnline: alias("connection.isOnline"),
    isOnlineStateDidChange: on("init", observer("isOnline", function () {
        const isOnline = this.get("isOnline");

        if (isOnline) {
            this.syncOnline();
        } else {
            this._removeAllListeners();
        }
    })),

    init() {
        this._super(...arguments);
        this.set("eventListeners", Ember.Object.create({}));
    },

    syncOnline() {
        debug("Starting online full sync");
        this.set("isSyncing", true);
        return this._reloadOnlineStore()
            .then(this._flushSyncQueue.bind(this))
            .then(this._updateOfflineStore.bind(this))
            .finally(() => {
                debug("Full sync has been completed");
                this.set("isSyncing", false);
                this.trigger("syncCompleted");
            });
    },

    _reloadOnlineStore() {
        this.get("onlineStore").unloadAll();
        this._removeAllListeners();

        return this.get("store")
            .findAll("event")
            .then(events => events.map(this._fetchOnlineEvent.bind(this)))
            .then(fetchOperations => Ember.RSVP.allSettled(fetchOperations));
    },

    _flushSyncQueue() {
        return this.get("syncQueue").flush();
    },

    _updateOfflineStore() {
        debug("Updating Offline Store");

        return this.get("store")
            .findAll("event")
            .then(events => events.rejectBy("isOffline", true))
            .then(events => events.map(this._replaceOfflineEvent.bind(this)))
            .then(operations => Ember.RSVP.allSettled(operations));
    },

    _fetchOnlineEvent(offlineEvent) {
        const id = offlineEvent.get("id");

        if (offlineEvent.get("isOffline")) {
            return Ember.RSVP.resolve();
        }

        this._unloadOnlineEvent(id);

        return this.get("onlineStore")
            .findRecord("event", id)
            .catch(this._onlineEventNotFound.bind(this, offlineEvent));
    },

    _replaceOfflineEvent(offlineEvent) {
        return this.get("onlineStore")
            .findRecord("event", offlineEvent.get("id"))
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
        debug(`Event ${offlineEvent.get("name")} not found online`);
        debug("Setting event as offline - it will be available to manual sync");
        offlineEvent.set("isOffline", true);
        this._removeListenerFor(offlineEvent.get("id"));
        this.trigger("conflict", {
            modelName: "event",
            type: "not-found-online",
            model: {
                id: offlineEvent.get("id"),
                name: offlineEvent.get("name"),
            },
        });

        return offlineEvent.save().then(() => Ember.RSVP.reject(error));
    },

    pushEventOffline(onlineEvent) {
        debug(`Syncing online event ${onlineEvent.get("name")} into offline store`);

        return this._pushToStore(this.get("store"), onlineEvent);
    },

    pushEventOnline(offlineEvent) {
        return this._pushToStore(this.get("onlineStore"), offlineEvent).then((onlineEvent) => {
            offlineEvent.set("isOffline", false);
            this._listenForChanges(onlineEvent);
            return offlineEvent.save();
        });
    },

    _pushToStore(store, model) {
        const normalized = this._normalizeModel(model);

        return store.push(normalized).save();
    },

    _normalizeModel(model) {
        const store = this.get("store");
        const snapshot = model._createSnapshot();
        const serializer = store.serializerFor(snapshot.modelName);
        const serialized = serializer.serialize(snapshot, { includeId: true });

        return store.normalize(snapshot.modelName, serialized);
    },

    _unloadOnlineEvent(id) {
        const event = this.get("onlineStore").peekRecord("event", id);

        if (event) {
            this.get("onlineStore").unloadRecord(event);
            this._removeListenerFor(id);
        }
    },

    // workaround to keep firebase realtime function
    _listenForChanges(onlineEvent) {
        const eventListeners = this.get("eventListeners");
        const eventId = onlineEvent.get("id");
        let isInitial = true;

        if (!eventListeners[eventId]) {
            const ref = onlineEvent.ref();

            onlineEvent.ref().on("value", (snapshot) => {
                Ember.run(() => {
                    // don't listen for initial on value
                    if (isInitial) {
                        isInitial = false;
                        return;
                    }
                    if (this.get("isSyncing") || this.get("syncQueue.isProcessing")) {
                        return;
                    }

                    const onlineEventId = snapshot.key;

                    // some changes in firebase not coming from this application instance
                    // schedule sync
                    Ember.run.scheduleOnce("actions", () => {
                        this.get("store")
                            .findRecord("event", onlineEventId)
                            .then(this._syncOneEvent.bind(this));
                    });
                });
            });
            eventListeners[eventId] = ref;
            this.set("eventListeners", eventListeners);
        }
    },

    _removeAllListeners() {
        Object.keys(this.get("eventListeners")).forEach(this._removeListenerFor.bind(this));
    },

    _removeListenerFor(eventId) {
        const eventListeners = this.get("eventListeners");
        const ref = eventListeners[eventId];

        if (ref) {
            ref.off("value");
            delete eventListeners[eventId];
        }
    },
});
