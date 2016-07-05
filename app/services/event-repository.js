import Ember from "ember";
import SyncRepositoryMixin from "splittypie/mixins/sync-repository";

const { service } = Ember.inject;

export default Ember.Service.extend(SyncRepositoryMixin, {
    offlineStore: service(),
    store: service(),
    syncer: service(),
    syncQueue: service(),
    connection: service(),
    isOffline: Ember.computed.alias("connection.isOffline"),
    isOnline: Ember.computed.alias("connection.isOnline"),

    find(id) {
        const record = this.get("store").findRecord("event", id);

        if (this.get("isOnline")) {
            const offlineRecord = this.get("offlineStore")
                      .findRecord("event", id)
                      .catch(() => false);

            Ember.RSVP.hash({
                offlineRecord,
                record,
            }).then(({ offlineRecord: offline, record: online }) => {
                if (!offline && online) {
                    this.get("syncer").pushToOfflineStore(online._createSnapshot());
                }
            });
        }

        return record;
    },

    save(event) {
        const operation = event.get("isNew") ? "createEvent" : "updateEvent";

        return event.save().then((record) => {
            if (this.get("isOffline")) {
                const payload = record.serialize({ includeId: true });

                this.get("syncQueue").enqueue(operation, payload);
            }

            return record;
        });
    },

    remove(event) {
        const id = event.get("id");

        return event.destroyRecord().then((result) => {
            if (this.get("isOffline")) {
                this.get("syncQueue").enqueue("removeEvent", { id });
            }

            return result;
        });
    },
});
