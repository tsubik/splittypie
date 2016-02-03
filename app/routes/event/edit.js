import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            event: this.modelFor("event"),
            currencies: this.store.findAll("currency"),
        });
    },

    setupController(controller, models) {
        this._super(controller, models);
        const eventForm = this.get("formFactory").createForm("event", models.event);
        controller.setProperties({
            event: eventForm,
            currencies: models.currencies,
        });
    },

    actions: {
        modelUpdated(event) {
            event.save()
                .then(() => this.transitionTo("event"));
        },
    },
});
