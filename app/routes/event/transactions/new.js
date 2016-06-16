import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    notify: service(),
    userContext: service(),

    model() {
        const event = this.modelFor("event");
        const payer = this.get("userContext.currentUser");
        const participants = event.get("users");

        return Ember.Object.create({
            payer,
            participants,
            date: new Date().toISOString().substring(0, 10),
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
            event.save().then(() => {
                this.transitionTo("event.transactions");
                this.get("notify").success("New transaction has been added");
            });
        },
    },
});
