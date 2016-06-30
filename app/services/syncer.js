import Ember from "ember";

const { getOwner } = Ember;
const { service } = Ember.inject;

export default Ember.Service.extend({
    offlineStore: service(),
    store: service(),

    syncDown(id) {
        const offlineStore = this.get("offlineStore");

        offlineStore.findRecord("event", id)
            .then(
                (event) => this.syncEvent(event, "down"),
                () => {
                    this.get("store").findRecord("event", id).then((event) => {
                        const snapshot = event._createSnapshot();
                        offlineStore.createRecord("event", snapshot).save();
                    });
                }
            );
    },

    syncEvents() {
        const offlineStore = this.get("offlineStore");
        offlineStore
            .findAll("event")
            .then((offlineEvents) => offlineEvents.forEach(this.syncEvent.bind(this)));
    },

    syncEvent(offlineEvent) {
        this.get("store").findRecord("event", offlineEvent.get("id")).then((onlineEvent) => {
            this.syncRecord(offlineEvent, onlineEvent);

            const onlineTransactions = onlineEvent.get("transactions");
            const offlineTransactions = offlineEvent.get("transactions");

            offlineEvent
                .get("transactions")
                .forEach((offlineTran) => {
                    const onlineTran = onlineEvent.get("transactions").findBy("id", offlineTran.get("id"));

                    this.syncRecord(offlineTran, onlineTran);
                });
        });
    },

    // syncCollection(offline, online, offlineWins) {

    // },

    syncRecord(offline, online) {
        const attributes = [];
        const timeDiff = offline.get("modifiedAt") - online.get("modifiedAt");
        const mustSync = timeDiff === 0;

        if (mustSync) {
            const offlineWins = timeDiff > 0;

            online.eachAttribute((a) => attributes.push(a));

            if (offlineWins) {
                online.setProperties(offline.getProperties(attributes));
                return online.save();
            }

            offline.setProperties(online.getProperties(attributes));
            return offline.save();
        }

        return Ember.RSVP.resolve(true);
    },
});
