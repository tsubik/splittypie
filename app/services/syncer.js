import { alias } from "@ember/object/computed";
import { run, scheduleOnce } from "@ember/runloop";
import { reject, resolve, allSettled } from "rsvp";
import EmberObject, {
  set,
  observer
} from "@ember/object";
import Service, { inject as service } from "@ember/service";
import Evented, { on } from "@ember/object/evented";

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
        const isOnline = this.isOnline;

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
        console.debug("Syncer: Starting online full sync");
        set(this, "isSyncing", true);
        this.trigger("syncStarted");
        return this._reloadOnlineStore()
            .then(this._flushSyncQueue.bind(this))
            .then(this._updateOfflineStore.bind(this))
            .finally(() => {
                console.debug("Syncer: Full sync has been completed");
                set(this, "isSyncing", false);
                this.trigger("syncCompleted");
            });
    },

    pushEventOffline(onlineEvent) {
        console.debug(`Syncer: Syncing online event ${onlineEvent.name} into offline store`);

        return this._pushToStore(this.store, onlineEvent);
    },

    pushEventOnline(offlineEvent) {
        return this._pushToStore(this.onlineStore, offlineEvent).then((onlineEvent) => {
            set(offlineEvent, "isOffline", false);
            this._listenForChanges(onlineEvent);
            return offlineEvent.save();
        });
    },

    _reloadOnlineStore() {
        this.onlineStore.unloadAll();
        this._removeAllListeners();

        return this.store
            .findAll("event")
            .then(events => events.map(this._fetchOnlineEvent.bind(this)))
            .then(fetchOperations => allSettled(fetchOperations));
    },

    _flushSyncQueue() {
        return this.syncQueue.flush();
    },

    _updateOfflineStore() {
        console.debug("Syncer: Updating Offline Store");

        return this.store
            .findAll("event")
            .then(events => events.rejectBy("isOffline", true))
            .then(events => events.map(this._replaceOfflineEvent.bind(this)))
            .then(operations => allSettled(operations));
    },

    _fetchOnlineEvent(offlineEvent) {
        const { id, isOffline } = offlineEvent;

        if (isOffline) {
            return resolve();
        }

        this._unloadOnlineEvent(id);

        return this.onlineStore
            .findRecord("event", id)
            .catch(this._onlineEventNotFound.bind(this, offlineEvent));
    },

    _replaceOfflineEvent(offlineEvent) {
        return this.onlineStore
            .findRecord("event", offlineEvent.id)
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
        const { id, name } = offlineEvent;

        console.debug(`Syncer: Event ${name} not found online`);
        console.debug("Syncer: Setting event as offline - it will be available to manual sync");
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
        const store = this.store;
        const snapshot = model._createSnapshot();
        const serializer = store.serializerFor(snapshot.modelName);
        const serialized = serializer.serialize(snapshot, { includeId: true });

        return store.normalize(snapshot.modelName, serialized);
    },

    _unloadOnlineEvent(id) {
        const event = this.onlineStore.peekRecord("event", id);

        if (event) {
            this.onlineStore.unloadRecord(event);
            this._removeListenerFor(id);
        }
    },

    // workaround to keep firebase realtime function
    _listenForChanges(onlineEvent) {
        const eventListeners = this.eventListeners;
        const eventId = onlineEvent.id;
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
                    if (this.isSyncing || this.syncQueue.isProcessing) {
                        return;
                    }

                    const onlineEventId = snapshot.key;

                    // some changes in firebase not coming from this application instance
                    // schedule sync
                    scheduleOnce("actions", () => {
                        this.store
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
        Object.keys(this.eventListeners).forEach(this._removeListenerFor.bind(this));
    },

    _removeListenerFor(eventId) {
        const eventListeners = this.eventListeners;
        const ref = eventListeners[eventId];

        if (ref) {
            ref.off("value");
            delete eventListeners[eventId];
        }
    },
});
