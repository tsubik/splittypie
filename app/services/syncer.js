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
        this.get("syncQueue")
            .flush()
            .then(this.syncEvents.bind(this))
            .finally(() => {
                this.set("isSyncing", false);
            });
    },

    syncEvents() {
        debug("Syncing Offline Events");
        return this.get("store")
            .findAll("event")
            .then(offlineEvents =>
                  offlineEvents.rejectBy("isOffline", true).map(this.syncEvent.bind(this))
            )
            .then(syncs => Ember.RSVP.allSettled(syncs));
    },

    syncEvent(offlineEvent) {
        // have to unload due to strange errors caused by emberfire adapter
        this._unloadOnlineEvent(offlineEvent.get("id"));
        return this.get("onlineStore").findRecord("event", offlineEvent.get("id"))
            .then((onlineEvent) => {
                this.pushEventOffline(onlineEvent);
                this._listenForChanges(onlineEvent);
            })
            .catch(() => {
                debug(`Event ${offlineEvent.get("name")} not found online`);
                debug("Setting event as offline - it will be available to sync it manually");
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
                return offlineEvent.save();
            });
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
                        this.get("store").findRecord("event", onlineEventId).then(
                            (offlineEvent) => this.syncEvent(offlineEvent)
                        );
                    });
                });
            });
            eventListeners[eventId] = ref;
            this.set("eventListeners", eventListeners);
        }
    },

    _removeAllListeners() {
        const eventListeners = this.get("eventListeners");
        Object.keys(eventListeners).forEach((key) => {
            eventListeners[key].off("value");
            delete eventListeners[key];
        });
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
