import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.find("transaction", params.transactionId);
    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set("users", this.modelFor("event").get("users"));
    },

    renderTemplate() {
        this.render({into: "application"});
    },

    actions: {
        save() {
            const transaction = this.currentModel;

            transaction.save().then(() => this.transitionTo("event.transactions"));
        }
    }
});