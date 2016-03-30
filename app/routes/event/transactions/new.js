import Ember from "ember";

export default Ember.Route.extend({
    model() {
        const users = this.modelFor("event").get("users");

        return Ember.Object.create({
            participants: users,
        });
    },

    afterModel(model) {
        model.set("event", this.modelFor("event"));
    },

    setupController(controller, model) {
        this._super(controller, model);
        const users = this.modelFor("event").get("users");
        const transactionForm = this.get("formFactory").createForm("transaction", model);
        controller.setProperties({
            transaction: transactionForm,
            users,
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
