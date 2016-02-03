import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),

    model() {
        return Ember.RSVP.hash({
            event: Ember.Object.create({
                users: [
                    Ember.Object.create({}),
                    Ember.Object.create({}),
                ],
            }),
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
                .then(() => this.get("localStorage").push(
                    "events",
                    Ember.Object.create(event.getProperties("id", "name"))
                ))
                .then(() => this.transitionTo("event.transactions.new", event));
        },
    },
});
