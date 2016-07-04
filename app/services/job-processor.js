import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    onlineStore: service(),
    offlineStore: service(),

    process(job) {
        const name = job.get("name");
        const payload = job.get("payload");
        const worker = this[name];

        Ember.assert(`Job ${name} doesn't exists`, worker);

        return worker.bind(this)(JSON.parse(payload));
    },

    createUpdateEvent(properties) {
        const onlineStore = this.get("onlineStore");
        const id = properties.id;
        const currency = onlineStore.findRecord("currency", properties.currency);

        return onlineStore.findRecord("event", id).then((onlineEvent) => {
            const users = onlineEvent.get("users").filter((user) => {
                return properties.users.contains(user.get("id"));
            });

            const object = {
                id,
                name: properties.name,
                currency,
                users,
            };

            onlineEvent.setProperties(object);

            return onlineEvent.save();
        }).catch(() => {

        });
    },

    removeEvent(properties) {
        const id = properties.id;
        return this.get("onlineStore").findRecord("event", id).then((event) => event.destroyRecord());
    },

    createUpdateTransaction(properties) {
        const onlineStore = this.get("onlineStore");
        const eventId = properties.event;
        const id = properties.id;

        return onlineStore.findRecord("event", eventId).then((event) => {
            let transaction = event.get("transactions").findBy("id", id);
            const payer = event.get("users").findBy("id", properties.payer);
            const participants = event.get("users").filter((user) => {
                return properties.participants.contains(user.get("id"));
            });
            const object = {
                id,
                name: properties.name,
                amount: properties.amount,
                date: properties.date,
                participants,
                payer,
            };

            if (transaction) {
                transaction.setProperties(object);
            } else {
                transaction = onlineStore.createRecord("transaction", object);
                event.get("transactions").addObject(transaction);
            }

            return event.save();
        });
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
