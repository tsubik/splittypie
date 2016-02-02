import Ember from "ember";

export default Ember.Route.extend({
    actions: {
        edit(transaction) {
            this.transitionTo("event.transactions.edit", transaction);
        },
    },
});
