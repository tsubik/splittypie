import Ember from "ember";

const {
    inject: { service },
    get,
    set,
    setProperties,
    Object: EmberObject,
    Route,
} = Ember;

export default Route.extend({
    notify: service(),
    transactionRepository: service(),
    userContext: service(),

    model() {
        const event = this.modelFor("event");
        const participants = get(event, "users");
        const payer = get(this, "userContext.currentUser");

        return EmberObject.create({
            payer,
            participants,
            date: new Date().toISOString().substring(0, 10),
        });
    },

    afterModel(model) {
        set(model, "event", this.modelFor("event"));
    },

    setupController(controller, model) {
        this._super(controller, model);
        const users = get(this.modelFor("event"), "users");
        const form = get(this, "formFactory").createForm("expense", model);
        setProperties(controller, {
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

            get(this, "transactionRepository")
                .save(event, transaction)
                .then(() => {
                    this.transitionTo("event.transactions");
                    get(this, "notify").success("New transaction has been added");
                });
        },
    },
});
