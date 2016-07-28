import Ember from "ember";

const { Route } = Ember;

export default Route.extend({
    actions: {
        edit(transaction) {
            this.transitionTo("event.transactions.edit", transaction);
        },
    },
});
