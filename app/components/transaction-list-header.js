import Ember from "ember";

const { computed } = Ember;

export default Ember.Component.extend({
    classNames: ["transaction-list-header"],

    currency: computed.alias("transactions.firstObject.event.currency.code"),
    count: computed.alias("transactions.length"),

    total: computed("transactions.[]", function () {
        const transactions = this.get("transactions");

        return transactions.reduce(
            (prev, curr) => prev + parseFloat(curr.get("amount")),
            0
        );
    }),
});
