import RSVP, { Promise } from 'rsvp';
import { get } from '@ember/object';
import Error from '@ember/error';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
    store: service(),
    onlineStore: service(),
    syncer: service(),
    syncQueue: service(),

    find(id) {
        return new Promise((resolve, reject) => {
            const offlineRecord = get(this, "store")
                      .findRecord("event", id)
                      .then((event) => {
                          resolve(event);
                          return event;
                      })
                      .catch(() => false);
            const onlineRecord = get(this, "onlineStore")
                      .findRecord("event", id)
                      .catch(() => false);

            RSVP.hash({
                offlineRecord,
                onlineRecord,
            }).then(({ offlineRecord: offline, onlineRecord: online }) => {
                if (!offline && online) {
                    resolve(
                        get(this, "syncer").pushEventOffline(online)
                    );
                } else if (!online && !offline) {
                    reject(new Error("no record was found"));
                }
            });
        });
    },

    save(event) {
        const operation = get(event, "isNew") ? "createEvent" : "updateEvent";

        return event.save().then((record) => {
            const payload = record.serialize({ includeId: true });

            delete payload.transactions;

            return get(this, "syncQueue")
                .enqueue(operation, payload)
                .then(() => record);
        });
    },

    remove(event) {
        const id = get(event, "id");

        return event
            .destroyRecord()
            .then(result => get(this, "syncQueue")
                  .enqueue("destroyEvent", { id })
                  .then(() => result)
                 );
    },
});
