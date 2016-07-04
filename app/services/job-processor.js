import Ember from "ember";

const { service } = Ember.inject;
const { debug } = Ember.Logger;

export default Ember.Service.extend({
    onlineStore: service(),
    offlineStore: service(),

    process(job) {
        const name = job.get("name");
        const payload = job.get("payload");
        const worker = this[name];
        debug(`processing job ${name} with payload: ${payload}`);

        Ember.assert(`Job ${name} doesn't exists`, worker);

        return worker.bind(this)(JSON.parse(payload));
    },

    createEvent(properties) {
        const onlineStore = this.get("onlineStore");
        const offlineStore = this.get("offlineStore");
        const modelClass = offlineStore.modelFor("event");
        const serializer = offlineStore.serializerFor("event");
        const normalized = serializer.normalize(modelClass, properties);

        return onlineStore.push(normalized).save();
    },

    updateEvent(properties) {
        const onlineStore = this.get("onlineStore");
        const id = properties.id;

        return onlineStore.findRecord("event", id).then((event) => {
            event.updateAttributes(properties);
            return event.save();
        });
    },

    removeEvent(properties) {
        const id = properties.id;
        return this.get("onlineStore").findRecord("event", id).then((event) => event.destroyRecord());
    },

    updateTransaction(properties) {
        const onlineStore = this.get("onlineStore");
        const id = properties.id;
        const eventId = properties.event;

        return onlineStore.findRecord("event", eventId).then((event) => {
            const transaction = event.get("transactions").findBy("id", id);

            if (transaction) {
                debugger;
                transaction.updateModel(properties);
                return transaction.save();
            }

            return Ember.RSVP.resolve(true);
        });
    },

    createTransaction(properties) {
        const onlineStore = this.get("onlineStore");
        const offlineStore = this.get("offlineStore");
        const modelClass = offlineStore.modelFor("transaction");
        const serializer = offlineStore.serializerFor("transaction");
        const normalized = serializer.normalize(modelClass, properties);

        return onlineStore.push(normalized).save();
    },

    removeTransaction(properties) {
        const eventId = properties.eventId;
        const id = properties.id;

        return this.get("onlineStore").findRecord("event", eventId).then((event) => {
            const transaction = event.get("transactions").findBy("id", id);
            event.get("transactions").removeObject(transaction);

            return event.save();
        });
    },
});
