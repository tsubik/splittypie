import Ember from "ember";
import EventForm from "splitr-lite/forms/event";

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            event: this.store.createRecord("event", {
                users: [
                    this.store.createRecord("user"),
                    this.store.createRecord("user")
                ]
            }),
            currencies: this.store.findAll("currency")
        }) ;
    },

    setupController(controller, models) {
        models.event = EventForm.create({model: models.event});
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
