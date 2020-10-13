import { notEmpty, filterBy } from "@ember/object/computed";
import EmberObject, { get, computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    tagName: "div",
    classNames: ["list-group"],

    expenses: filterBy("transactions", "typeOrDefault", "expense"),
    anyTransactions: notEmpty("transactions"),
    transactionsByMonth: computed("transactions.[]", function () {
        const result = [];
        const transactions = this.transactions.sortBy("date").reverse();

        transactions.forEach((transaction) => {
            const month = get(transaction, "month");
            const group = result.findBy("month", month);

            if (!group) {
                result.pushObject(
                    EmberObject.create({ month, transactions: [transaction] })
                );
            } else {
                get(group, "transactions").pushObject(transaction);
            }
        });

        return result;
    }),
    anyTransactionWithDate: computed("transactions.[]", function () {
        const transactions = this.transactions;

        return transactions.any(transaction => !!get(transaction, "date"));
    }),

    actions: {
        edit(transaction) {
            this.onEdit(transaction);
        },
    },
});
