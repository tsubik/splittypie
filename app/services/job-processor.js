import Ember from "ember";

const { service } = Ember.inject;
const { debug } = Ember.Logger;

export default Ember.Service.extend({
    onlineStore: service(),
    store: service(),

    process(job) {
        const name = job.get("name");
        const payload = job.get("payload");
        const method = this[name];
        debug(`processing job ${name} with payload: ${payload}`);

        Ember.assert(`Job ${name} doesn't exists`, method);

        return method.bind(this)(JSON.parse(payload))
            .then((result) => {
                debug(`Job ${name} has successfully completed`);
                return result;
            })
            .catch((error) => {
                debug("ERROR", error);
                return error;
            });
    },

    createEvent(properties) {
        return this._createModel("event", properties);
    },

    updateEvent(properties) {
        const onlineStore = this.get("onlineStore");
        const id = properties.id;

        return onlineStore.findRecord("event", id).then((event) => {
            event.updateModel(properties);
            return event.save();
        });
    },

    removeEvent(properties) {
        const onlineStore = this.get("onlineStore");
        const id = properties.id;

        return onlineStore.findRecord("event", id).then((event) => event.destroyRecord());
    },

    updateTransaction(properties) {
        const onlineStore = this.get("onlineStore");
        const id = properties.id;
        const eventId = properties.event;

        // return onlineStore.findRecord("event", eventId).then((event) => {
        return onlineStore.findRecord("transaction", id).then((transaction) => {
            // const transaction = event.get("transactions").findBy("id", id);

            if (transaction) {
                transaction.updateModel(properties);
                return transaction.save();
            }

            return Ember.RSVP.resolve(true);
        });
    },

    createTransaction(properties) {
        return this._createModel("transaction", properties);
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

    _createModel(modelName, properties) {
        const onlineStore = this.get("onlineStore");
        const offlineStore = this.get("store");
        const modelClass = offlineStore.modelFor(modelName);
        const serializer = offlineStore.serializerFor(modelName);
        const normalized = serializer.normalize(modelClass, properties);

        return onlineStore.push(normalized).save();
    },
});
