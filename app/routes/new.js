import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            model: this.store.createRecord("event", {
                users: [
                    this.store.createRecord("user"),
                    this.store.createRecord("user")
                ]
            }),
            currencies: this.store.findAll("currency")
        }) ;
    },

    setupController(controller, models) {
        this._super(controller, models);
        controller.setProperties({
            model: models.model,
            currencies: models.currencies
        });
    },

    actions: {
        createEvent() {
            this.currentModel.model.save()
                .then((event) => {
                    this.transitionTo("event.transactions.new", event);
                });
        }
    }
});
