import Ember from "ember";

const { computed } = Ember;

export default Ember.Component.extend({
    classNames: ["transaction-list-header"],

    currency: computed.alias("transactions.firstObject.event.currency.code"),

    totalUser: computed("transactions.[]", "currentUser", function () {
        const transactions = this.get("transactions");
        const currentUser = this.get("currentUser");
        const paidTransactions = transactions.filterBy("payer", currentUser);

        return paidTransactions.reduce(
            (prev, curr) => prev + parseFloat(curr.get("amount")),
            0
        );
    }),

    total: computed("transactions.[]", function () {
        const transactions = this.get("transactions");

        return transactions.reduce(
            (prev, curr) => prev + parseFloat(curr.get("amount")),
            0
        );
    }),
});
