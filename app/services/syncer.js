import Ember from "ember";

const {
    inject: { service },
    Logger: { debug },
    computed: { alias },
    observer,
    on,
} = Ember;

export default Ember.Service.extend({
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
        }
    })),

    init() {
        this._super(...arguments);
        this.set("eventListeners", Ember.Object.create({}));
    },

    syncOnline() {
        this.set("isSyncing", true);
        this.get("syncQueue")
            .flush()
            .then(() => this.syncEvents())
            .then(() => {
                this.set("isSyncing", false);
            });
    },

    syncEvents() {
        debug("Syncing Online Events");
        return this.get("store")
            .findAll("event")
            .then((offlineEvents) => offlineEvents.map(this.syncEvent.bind(this)))
            .then((syncs) => Ember.RSVP.allSettled(syncs));
    },

    syncEvent(offlineEvent) {
        return this.get("onlineStore").findRecord("event", offlineEvent.get("id"), { reload: true })
            .then((onlineEvent) => {
                const snapshot = onlineEvent._createSnapshot();

                this.pushToOfflineStore(snapshot);
                this.listenForChanges(onlineEvent);
            })
            .catch(() => {
                debug(`Event ${offlineEvent.get("name")} not found online`);
                debug("Removing from offline store...");
                return offlineEvent.destroyRecord();
            });
    },

    pushToOfflineStore(snapshot) {
        debug(`Syncing online event ${snapshot.record.get("name")} into offline store`);
        const offlineStore = this.get("store");
        const type = snapshot.modelName;
        const serializer = this.get("store").serializerFor(type);
        const serialized = serializer.serialize(snapshot, { includeId: true });
        const normalized = offlineStore.normalize(type, serialized);

        const model = offlineStore.push(normalized);
        return model.save();
    },

    // workaround to keep firebase realtime function
    listenForChanges(onlineEvent) {
        const eventListeners = this.get("eventListeners");
        const eventId = onlineEvent.get("id");
        let isInitial = true;
        let listener = eventListeners[eventId];

        if (!listener) {
            listener = onlineEvent.ref().on("value", (snapshot) => {
                if (isInitial) {
                    isInitial = false;
                    return;
                }
                if (this.get("isSyncing") || this.get("syncQueue.isProcessing")) {
                    return;
                }

                const onlineEventId = snapshot.key;

                // some changes in firebase not coming from this application
                // schedule sync
                Ember.run.once(() => {
                    this.get("store").findRecord("event", onlineEventId).then(
                        (offlineEvent) => this.syncEvent(offlineEvent)
                    );
                });
            });
            eventListeners[eventId] = listener;
            this.set("eventListeners", eventListeners);
        }
    },
});
