/* eslint-disable arrow-body-style */

import Ember from "ember";

const {
    inject: { service },
    get,
    Service,
} = Ember;

export default Service.extend({
    syncQueue: service(),

    save(event, transaction) {
        let operation = "updateTransaction";

        if (get(transaction, "isNew")) {
            operation = "createTransaction";
            get(event, "transactions").addObject(transaction);
        }

        return event.save().then(() => {
            const payload = transaction.serialize({ includeId: true });

            // workaround, if I don't save here model will remain in isNew or dirty state
            // offline adapter for transaction is overridden to prevent from
            // saving second time on "transactions" node to indexedDB
            // localforage adapter should deal with it but it doesn't
            return get(this, "syncQueue")
                .enqueue(operation, payload)
                .then(() => transaction.save());
        });
    },

    remove(transaction) {
        const event = get(transaction, "event");
        const eventId = get(event, "id");
        const id = get(transaction, "id");

        get(event, "transactions").removeObject(transaction);
        return event.save().then(() => {
            // workaround, localforage adapter should deal with it
            // but it doesn't unload record from store
            return get(this, "syncQueue")
                .enqueue("destroyTransaction", { eventId, id })
                .then(() => transaction.destroyRecord());
        });
    },
});
