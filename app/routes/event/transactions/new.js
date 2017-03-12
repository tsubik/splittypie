import Ember from "ember";
import moment from "moment";

const {
    inject: { service },
    get,
    getWithDefault,
    set,
    setProperties,
    Object: EmberObject,
    Route,
} = Ember;

export default Route.extend({
    notify: service(),
    transactionRepository: service(),
    userContext: service(),

    model(params) {
        const amount = getWithDefault(params, "amount", null);
        const date = getWithDefault(params, "date", moment().format("YYYY-MM-DD"));
        const event = this.modelFor("event");
        const name = getWithDefault(params, "name", null);
        const participants = get(event, "users");
        const payer = get(this, "userContext.currentUser");

        return EmberObject.create({
            amount,
            date,
            name,
            participants,
            payer,
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
