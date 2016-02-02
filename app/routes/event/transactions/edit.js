import Ember from "ember";

export default Ember.Route.extend({
    model(params) {
        return this.store.find("transaction", params.transaction_id);
    },

    setupController(controller, model) {
        this._super(controller, model);
        const transactionForm = this.get("formFactory").createForm("transaction", model);
        controller.setProperties({
            transaction: transactionForm,
            users: this.modelFor("event").get("users"),
        });
    },

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        delete(transaction) {
            const event = this.modelFor("event");

            event.get("transactions").removeObject(transaction);
            event.save().then(() => this.transitionTo("event.transactions"));
        },

        modelUpdated() {
            const event = this.modelFor("event");

            event.save().then(() => this.transitionTo("event.transactions"));
        },
    },
});
