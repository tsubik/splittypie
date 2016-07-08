import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    store: service(),
    onlineStore: service(),
    syncer: service(),
    syncQueue: service(),

    find(id) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            const offlineRecord = this.get("store")
                      .findRecord("event", id)
                      .then((event) => {
                          resolve(event);
                          return event;
                      })
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
                        this.get("syncer").pushEventOffline(online)
                    );
                } else if (!online && !offline) {
                    reject(new Ember.Error("no record was found"));
                }
            });
        });
    },

    save(event) {
        const operation = event.get("isNew") ? "createEvent" : "updateEvent";

        return event.save().then((record) => {
            const payload = record.serialize({ includeId: true });

            delete payload.transactions;

            this.get("syncQueue").enqueue(operation, payload);

            return record;
        });
    },

    destroy(event) {
        const id = event.get("id");

        return event.destroyRecord().then((result) => {
            this.get("syncQueue").enqueue("destroyEvent", { id });

            return result;
        });
    },
});
