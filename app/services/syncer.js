import Ember from "ember";

const { service } = Ember.inject;
const { debug } = Ember.Logger;

export default Ember.Service.extend({
    store: service(),
    onlineStore: service(),
    connection: service(),
    syncQueue: service(),

    syncOnline() {
        this.get("syncQueue")
            .flush()
            .then(() => this.syncEvents());
    },

    syncEvents() {
        debug("Syncing Online Events");
        this.get("store")
            .findAll("event")
            .then((offlineEvents) => offlineEvents.forEach(this.syncEvent.bind(this)));
    },

    syncEvent(offlineEvent) {
        this.get("onlineStore").findRecord("event", offlineEvent.get("id"), { reload: true }).then((onlineEvent) => {
            const snapshot = onlineEvent._createSnapshot();
            this.pushToOfflineStore(snapshot);
        }).catch(() => {
            debug(`Event ${offlineEvent.get("name")} not found online`);
            debug("Removing...");
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
});
