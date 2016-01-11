import Ember from "ember";
import EventRouteMixin from "splitr-lite/mixins/event-route-mixin";

export default Ember.Route.extend(EventRouteMixin, {
    model(params) {
        return this.store.find("transaction", params.transactionId);
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

            transaction.save().then(() => this.transitionTo("event.transactions"));
        },

        willTransition() {
            const transaction = this.currentModel;

            transaction.rollbackAttributes();
        }
    }
});