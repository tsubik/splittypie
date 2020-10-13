import { computed } from "@ember/object";
import ModelMixin from "splittypie/mixins/model-mixin";
import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend(ModelMixin, {
    name: attr("string"),
    event: belongsTo("event", { async: false }),
    balance: computed("event.transactions.[]", function () {
        const transactions = this.event.transactions;
        const paidTransactions = transactions.filterBy("payer", this);
        const owedTransactions = transactions.filter(t => t.participants.includes(this));
        const paidMoney = paidTransactions.reduce(
            (acc, t) => acc + parseFloat(t.amount),
            0
        );
        const owedMoney = owedTransactions.reduce(
            (acc, t) => acc + (parseFloat(t.amount) / t.participants.length),
            0
        );

        return (paidMoney - owedMoney).toFixed(2);
    }),
});
