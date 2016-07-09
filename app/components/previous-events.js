import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Component.extend({
    localStorage: service(),
    modal: service(),

    classNames: ["previous-events-container"],
    attributeBindings: ["id"],

    tagName: "section",
    id: "events",

    anyEvents: Ember.computed.notEmpty("events"),

    _removeEventFromOfflineStore(event) {
        const storage = this.get("localStorage");
        const lastEventId = storage.getItem("lastEventId");

        // remove only from offline store
        event.destroyRecord();

        if (lastEventId === event.id) {
            storage.removeItem("lastEventId");
        }
    },

    actions: {
        remove(event) {
            const storage = this.get("localStorage");
            const showModal = storage.getItem("remove-prev-events-got-it") !== "true";

            if (showModal) {
                const yes = () => {
                    this._removeEventFromOfflineStore(event);
                    this.get("modal").trigger("hide");
                };

                this.get("modal").trigger("show", {
                    name: "remove-previous-event",
                    actions: {
                        yes,
                        yes_remember: () => {
                            storage.setItem("remove-prev-events-got-it", "true");
                            yes();
                        },
                    },
                    event,
                });
            } else {
                this._removeEventFromOfflineStore(event);
            }
        },
    },
});
