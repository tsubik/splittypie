import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    syncQueue: service(),
    onlineStore: service(),

    save(event, transaction) {
        let operation = "updateTransaction";

        if (transaction.get("isNew")) {
            operation = "createTransaction";
            event.get("transactions").pushObject(transaction);
        }

        return event.save().then(() => {
            const payload = transaction.serialize({ includeId: true });

            this.get("syncQueue").enqueue(operation, payload);

            return transaction.save();
        });
    },

    remove(transaction) {
        const event = transaction.get("event");
        const eventId = event.get("id");
        const id = transaction.get("id");

        event.get("transactions").removeObject(transaction);
        return event.save().then((res) => {
            this.get("syncQueue").enqueue("removeTransaction", { eventId, id });

            return res;
        });
    },
});
