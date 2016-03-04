import Ember from "ember";

export default Ember.Component.extend({
    localStorage: Ember.inject.service(),
    modal: Ember.inject.service(),

    classNames: ["previous-events-container"],

    anyEvents: Ember.computed.notEmpty("events"),

    actions: {
        remove(event) {
            const showModal = window.localStorage.getItem("remove-prev-events-got-it") !== "true";

            if (showModal) {
                const yes = () => {
                    this.get("localStorage").remove("events", event.id);
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
                this.get("localStorage").remove("events", event.id);
            }
        },
    },
});
