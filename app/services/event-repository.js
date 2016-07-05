import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    store: service(),
    onlineStore: service(),
    syncer: service(),
    syncQueue: service(),
    connection: service(),
    isOffline: Ember.computed.alias("connection.isOffline"),
    isOnline: Ember.computed.alias("connection.isOnline"),

    find(id) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            const offlineRecord = this.get("store")
                      .findRecord("event", id)
                      .then(resolve)
                      .catch(() => false);
            const onlineRecord = this.get("onlineStore")
                      .findRecord("event", id)
                      .catch(() => false);

            Ember.RSVP.hash({
                offlineRecord,
                onlineRecord,
            }).then(({ offlineRecord: offline, onlineRecord: online }) => {
                if (!offline && online) {
                    resolve(
                        this.get("syncer").pushToOfflineStore(online._createSnapshot())
                    );
                } else if (!offline && !online) {
                    reject("not-found");
                }
            });
        });
    },

    save(event) {
        const operation = event.get("isNew") ? "createEvent" : "updateEvent";

        return event.save().then((record) => {
            // const serializer = this.get("store").serializerFor("event");
            // const payload = serializer.serialize(record._createSnapshot(), { includeId: true });
            const payload = record.serialize({ includeId: true });

            delete payload.transactions;

            this.get("syncQueue").enqueue(operation, payload);

            return record;
        });
    },

    remove(event) {
        const id = event.get("id");

        return event.destroyRecord().then((result) => {
            this.get("syncQueue").enqueue("removeEvent", { id });

            return result;
        });
    },
});
