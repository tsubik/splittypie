import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return Ember.Object.create({});
    },

    afterModel(model) {
        model.set("event", this.modelFor("event"));
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
        modelUpdated(transaction) {
            const event = this.modelFor("event");

            event.get("transactions").pushObject(transaction);
            event.save().then(() => this.transitionTo("event.transactions"));
        },
    },
});
