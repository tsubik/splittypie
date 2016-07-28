import Ember from "ember";
import ModelMixin from "splittypie/mixins/model-mixin";
import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

const {
    computed,
    get,
} = Ember;

export default Model.extend(ModelMixin, {
    name: attr("string"),
    event: belongsTo("event", { async: false }),
    balance: computed("event.transactions.[]", function () {
        const transactions = get(this, "event.transactions");
        const paidTransactions = transactions.filterBy("payer", this);
        const owedTransactions = transactions.filter((t) => get(t, "participants").contains(this));
        const paidMoney = paidTransactions.reduce(
            (acc, curr) => acc + parseFloat(get(curr, "amount")),
            0
        );
        const owedMoney = owedTransactions.reduce(
            (acc, curr) => acc + parseFloat(get(curr, "amount")) / get(curr, "participants").length,
            0
        );

        return (paidMoney - owedMoney).toFixed(2);
    }),
});
