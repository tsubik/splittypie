import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),

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

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        delete(event) {
            event.destroyRecord().then(() => {
                this.get("localStorage").remove("events", event.id);
                this.transitionTo("index");
            });
        },

        modelUpdated(event) {
            event.save()
                .then(() => this.get("localStorage").push(
                    "events",
                    Ember.Object.create(event.getProperties("id", "name"))
                ))
                .then(() => this.transitionTo("event"));
        },
    },
});
