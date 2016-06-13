import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["list-group"],

    anyTransactions: Ember.computed.notEmpty("transactions"),
    transactionsByMonth: Ember.computed("transactions.[]", function () {
        const result = [];
        const transactions = this.get("transactions").sortBy("date").reverse();

        transactions.forEach((transaction) => {
            const month = transaction.get("month");
            const group = result.findBy("month", month);

            if (!group) {
                result.pushObject(
                    Ember.Object.create({ month, transactions: [transaction] })
                );
            } else {
                group.get("transactions").pushObject(transaction);
            }
        });

        return result;
    }),
    anyTransactionWithDate: Ember.computed("transactions.[]", function () {
        const transactions = this.get("transactions");

        return transactions.any(transaction => !!transaction.get("date"));
    }),

    actions: {
        edit(transaction) {
            this.sendAction("edit", transaction);
        },
    },
});
