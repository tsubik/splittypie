import { alias } from "@ember/object/computed";
import { get, computed } from "@ember/object";
import Component from "@ember/component";

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
