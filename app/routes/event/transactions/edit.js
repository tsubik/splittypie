import { inject as service } from "@ember/service";
import { setProperties, get } from "@ember/object";
import Route from "@ember/routing/route";

export default Route.extend({
    notify: service(),
    transactionRepository: service(),

    model(params) {
        return this.store.findRecord("transaction", params.transaction_id);
    },

    setupController(controller, model) {
        this._super(controller, model);
        const type = get(model, "typeOrDefault");
        const form = this.formFactory.createForm(type, model);
        setProperties(controller, {
            form,
            users: this.modelFor("event").users,
        });
    },

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        delete(transaction) {
            this.transactionRepository
                .remove(transaction)
                .then(() => {
                    this.transitionTo("event.transactions");
                    this.notify.success("Transaction has been deleted.");
                });
        },

        modelUpdated(transaction) {
            const event = this.modelFor("event");

            this.transactionRepository
                .save(event, transaction)
                .then(() => {
                    this.transitionTo("event.transactions");
                    this.notify.success("Transaction has been changed.");
                });
        },
    },
});
