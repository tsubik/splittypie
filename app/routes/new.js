import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            event: Ember.Object.create({
                users: [
                    Ember.Object.create({}),
                    Ember.Object.create({})
                ]
            }),
            currencies: this.store.findAll("currency")
        }) ;
    },

    setupController(controller, models) {
        models.event = this.get("formFactory").createForm("event", models.event);
        this._super(controller, models);
        controller.setProperties({
            event: models.event,
            currencies: models.currencies
        });
    },

    actions: {
        modelUpdated(event) {
            event.save()
                .then(() => this.transitionTo("event.transactions.new", event));
        }
    }
});
