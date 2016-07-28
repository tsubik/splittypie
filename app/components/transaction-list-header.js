import Ember from "ember";

const {
    computed: { alias },
    computed,
    get,
    Component,
} = Ember;

export default Component.extend({
    classNames: ["transaction-list-header"],

    currency: alias("transactions.firstObject.event.currency.code"),
    count: alias("transactions.length"),

    total: computed("transactions.[]", function () {
        const transactions = get(this, "transactions");

        return transactions.reduce(
            (prev, curr) => prev + parseFloat(get(curr, "amount")),
            0
        );
    }),
});
