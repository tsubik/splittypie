import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Component.extend({
    localData: service(),
    modal: service(),

    classNames: ["previous-events-container"],
    attributeBindings: ["id"],

    tagName: "section",
    id: "events",

    anyEvents: Ember.computed.notEmpty("events"),

    actions: {
        remove(event) {
            const showModal = window.localStorage.getItem("remove-prev-events-got-it") !== "true";

            if (showModal) {
                const yes = () => {
                    this.get("localData").removeEvent(event.id);
                    this.get("modal").trigger("hide");
                };

                this.get("modal").trigger("show", {
                    name: "remove-previous-event",
                    actions: {
                        yes,
                        yes_remember: () => {
                            window.localStorage.setItem("remove-prev-events-got-it", "true");
                            yes();
                        },
                    },
                    event,
                });
            } else {
                this.get("localData").removeEvent(event.id);
            }
        },
    },
});
