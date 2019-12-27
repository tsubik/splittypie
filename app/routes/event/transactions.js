import Route from "@ember/routing/route";

export default Route.extend({
    actions: {
        edit(transaction) {
            this.transitionTo("event.transactions.edit", transaction);
        },
    },
});
