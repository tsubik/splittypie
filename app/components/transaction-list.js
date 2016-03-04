import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["list-group"],

    anyTransactions: Ember.computed.notEmpty("transactions"),
    transactionsByDate: Ember.computed("transactions.[]", function () {
        const result = [];
        const transactions = this.get("transactions").sortBy("date").reverse();

        transactions.forEach((transaction) => {
            const date = transaction.get("date") || null;
            const group = result.findBy("date", date);

            if (!group) {
                result.pushObject(
                    Ember.Object.create({ date, transactions: [transaction] })
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
