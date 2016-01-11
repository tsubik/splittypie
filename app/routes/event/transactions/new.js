import Ember from "ember";
import EventRouteMixin from "splitr-lite/mixins/event-route-mixin";

export default Ember.Route.extend(EventRouteMixin, {
    model() {
        return this.store.createRecord("transaction");
    },

    setupController(controller, model) {
        this._super(controller, model);
        this._setupCurrency(controller);
        controller.set("users", this.modelFor("event").get("users"));
    },

    renderTemplate() {
        this.render({into: "application"});
    },

    actions: {
        save() {
            const transaction = this.currentModel;
            const event = this.modelFor("event");

            event.get("transactions").pushObject(transaction);
            event.save().then(() => this.transitionTo("event.transactions"));
        }
    }
});