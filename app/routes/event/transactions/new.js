import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),

    model() {
        const event = this.modelFor("event");
        const eventLS = this.get("localStorage").find("events", event.id);
        const participants = event.get("users");
        const payer = participants.findBy("id", eventLS.userId);

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
            event.save().then(() => this.transitionTo("event.transactions"));
        },
    },
});
