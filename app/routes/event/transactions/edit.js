import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    notify: service(),

    model(params) {
        return this.store.find("transaction", params.transaction_id);
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
            const event = this.modelFor("event");

            event.get("transactions").removeObject(transaction);
            event.save().then(() => {
                this.transitionTo("event.transactions");
                this.get("notify").success("Transaction has been deleted.");
            });
        },

        modelUpdated() {
            const event = this.modelFor("event");

            event.save().then(() => {
                this.transitionTo("event.transactions");
                this.get("notify").success("Transaction has been changed.");
            });
        },
    },
});
