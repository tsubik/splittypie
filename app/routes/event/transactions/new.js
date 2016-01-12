import Ember from "ember";
import TransactionForm from "splitr-lite/forms/transaction";

export default Ember.Route.extend({
    model() {
        return this.store.createRecord("transaction");
    },

    setupController(controller, model) {
        model.set("event", this.modelFor("event"));
        model = TransactionForm.create({ model: model });
        this._super(controller, model);
        controller.setProperties({
            transaction: model,
            users: this.modelFor("event").get("users")
        });
    },

    renderTemplate() {
        this.render({into: "application"});
    },

    actions: {
        modelUpdated(transaction) {
            const event = this.modelFor("event");

            event.get("transactions").pushObject(transaction);
            event.save().then(() => this.transitionTo("event.transactions"));
        },

        willTransition() {
            const transaction = this.currentModel;

            if (transaction.get("isNew")) {
                transaction.destroyRecord();
            }
        }
    }
});