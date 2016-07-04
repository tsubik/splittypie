import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    offlineStore: service(),
    store: service(),
    connection: service(),
    syncQueue: service(),

    syncOnline() {
        this.get("syncQueue").flush();
        this.syncEvents();
    },

    syncEvents() {
        const offlineStore = this.get("offlineStore");
        offlineStore
            .findAll("event")
            .then((offlineEvents) => offlineEvents.forEach(this.syncEvent.bind(this)));
    },

    syncEvent(offlineEvent) {
        this.get("store").findRecord("event", offlineEvent.get("id")).then((onlineEvent) => {
            const snapshot = onlineEvent._createSnapshot();
            this.pushToOfflineStore(snapshot);
        });
    },

    pushToOfflineStore(snapshot) {
        const offlineStore = this.get("offlineStore");
        const type = snapshot.modelName;
        const serializer = this.get("offlineStore").serializerFor(type);
        const serialized = serializer.serialize(snapshot, { includeId: true });
        const normalized = offlineStore.normalize(type, serialized);

        const model = offlineStore.push(normalized);
        model.save();
    },
});
