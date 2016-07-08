import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    notify: service(),
    transactionRepository: service(),

    model(params) {
        return this.store.findRecord("transaction", params.transaction_id);
    },

    setupController(controller, model) {
        this._super(controller, model);
        const type = model.get("type") || "expense";
        const form = this.get("formFactory").createForm(type, model);
        controller.setProperties({
            form,
            users: this.modelFor("event").get("users"),
        });
    },

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        delete(transaction) {
            this.get("transactionRepository")
                .destroy(transaction)
                .then(() => {
                    this.transitionTo("event.transactions");
                    this.get("notify").success("Transaction has been deleted.");
                });
        },

        modelUpdated(transaction) {
            const event = this.modelFor("event");

            this.get("transactionRepository")
                .save(event, transaction)
                .then(() => {
                    this.transitionTo("event.transactions");
                    this.get("notify").success("Transaction has been changed.");
                });
        },
    },
});
