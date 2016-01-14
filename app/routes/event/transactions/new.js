import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return Ember.Object.create({});
    },

    setupController(controller, model) {
        model.set("event", this.modelFor("event"));
        model = this.get("formFactory").createForm("transaction", model);
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
        }
    }
});