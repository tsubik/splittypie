import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    localStorage: service(),
    notify: service(),
    transactionRepository: service(),

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
        const form = this.get("formFactory").createForm("expense", model);
        controller.setProperties({
            form,
            users,
        });
    },

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        modelUpdated(transaction) {
            const event = this.modelFor("event");

            this.get("transactionRepository")
                .save(event, transaction)
                .then(() => {
                    this.transitionTo("event.transactions");
                    this.get("notify").success("New transaction has been added");
                });
        },
    },
});
