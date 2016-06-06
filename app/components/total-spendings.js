import Ember from "ember";

export default Ember.Component.extend({
    anyTransactions: Ember.computed.notEmpty("event.transactions"),

    total: Ember.computed("event", function () {
        const transactions = this.get("event.transactions");

        return transactions.reduce(
            (prev, curr) => prev + parseFloat(curr.get("amount")),
            0
        );
    }),
});
