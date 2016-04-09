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
            this.transitionTo("event.who-are-you", model);
        }
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
    },
});
