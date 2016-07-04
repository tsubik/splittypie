import Ember from "ember";
import SyncRepositoryMixin from "splittypie/mixins/sync-repository";

const { service } = Ember.inject;

export default Ember.Service.extend(SyncRepositoryMixin, {
    store: service(),
    offlineStore: service(),
    syncer: service(),
    syncQueue: service(),
    connection: service(),
    isOffline: Ember.computed.alias("connection.isOffline"),

    find(id) {
        // TODO: RxJS????? To replace offline model with online
        // or one store many adapters

        return new Ember.RSVP.Promise((resolve, reject) => {
            const offlineRecord = this.get("offlineStore")
                      .findRecord("event", id)
                      .catch(() => false);
            const onlineRecord = this.get("store").findRecord("event", id);

            Ember.RSVP.hash({
                offlineRecord,
                onlineRecord,
            }).then(({ offlineRecord: offline, onlineRecord: online }) => {
                if (!offline && online) {
                    this.get("syncer").pushToOfflineStore(online._createSnapshot());
                }

                if (online) {
                    resolve(online);
                } else if (offline) {
                    resolve(offline);
                } else {
                    reject("not found");
                }
            });
        });
    },

    save(event) {
        return event.save().then((record) => {
            if (this.get("isOffline")) {
                const payload = record.serialize({ includeId: true });

                this.get("syncQueue").enqueue("createUpdateEvent", payload);
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
