import Ember from "ember";
import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    users: DS.hasMany("user", {async: false}),
    transactions: DS.hasMany("transaction", {async: false}),
    metaData: DS.belongsTo("event", {async: false}),
    paidOwned: Ember.computed("users", "transactions", "transactions.@each.amount", function () {
        const users = this.get("users");

        return users.map(createPaidOwnedRecordForUser.bind(this));
    })
});

function createPaidOwnedRecordForUser(user) {
    const transactions = this.get("transactions");
    const paidTransactions = transactions.filterBy("payer", user);
    const ownedTransactions = transactions.filter((transaction) => transaction.get("participants").contains(user));

    const paid = paidTransactions.reduce((prev, curr) => {
        return prev + parseFloat(curr.get("amount"));
    }, 0);
    const owned = ownedTransactions.reduce((prev, curr) => {
        return prev + parseFloat(curr.get("amount")) / curr.get("participants").length;
    }, 0);

    return Ember.Object.create({
        user: user,
        summary: paid - owned
    });
}
