import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),
    modal: Ember.inject.service(),

    model(params) {
        return this.store.find("event", params.event_id);
    },

    afterModel(model) {
        const eventLS = this.get("localStorage").find("events", model.id);

        if (!(eventLS && eventLS.userId)) {
            this.transitionTo("event.who-are-you");
        }

        window.localStorage.setItem("lastEventId", model.id);
    },

    setupController(controller, model) {
        this._super(...arguments);
        const previousEvents = this.modelFor("application").previousEvents;
        const otherEvents = previousEvents.rejectBy("id", model.id);

        controller.setProperties({ otherEvents });
    },

    actions: {
        share() {
            const event = this.modelFor("event");

            this.get("modal").trigger("show", {
                name: "share",
                event,
            });
        },

        saveChanges() {
            const event = this.modelFor("event");

            event.save();
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const lastEventId = window.localStorage.getItem("lastEventId");

            if (eventId === lastEventId) {
                window.localStorage.removeItem("lastEventId");

                this.transitionTo("index");
            } else {
                return true;
            }

            return false;
        },
    },
});
