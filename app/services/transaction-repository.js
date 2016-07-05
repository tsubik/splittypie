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
            const serializer = this.get("onlineStore").serializerFor("transaction");
            const snapshot = transaction._createSnapshot();
            const payload = serializer.serialize(snapshot, { includeId: true });

            this.get("syncQueue").enqueue(operation, payload);

            return transaction;
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
