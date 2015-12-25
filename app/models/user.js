import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend({
    name: DS.attr("string"),
    event: DS.belongsTo("event", {async: false}),
    balance: Ember.computed("event.transactions.[]", function () {
        const transactions = this.get("event.transactions");
        const paidTransactions = transactions.filterBy("payer", this);
        const owedTransactions = transactions.filter((t) => t.get("participants").contains(this));
        const paidMoney = paidTransactions.reduce((prev, curr) => {
            return prev + parseFloat(curr.get("amount"));
        }, 0);
        const owedMoney = owedTransactions.reduce((prev, curr) => {
            return prev + parseFloat(curr.get("amount")) / curr.get("participants").length;
        }, 0);

        return (paidMoney - owedMoney).toFixed(2);
    })
});
