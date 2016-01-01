import Ember from "ember";

export default Ember.Component.extend({
    anyTransactions: Ember.computed.notEmpty("transactions"),

    actions: {
        deleteTransaction(transaction) {
            this.get("transactions").removeObject(transaction);
            this.sendAction("saveChanges");
        },

        updatePayer(transaction, payer) {
            transaction.set("payer", payer);
            transaction.save();
        },

        updateParticipants(transaction, participants) {
            transaction.set("participants", participants);
            transaction.save();
        },

        saveChanges() {
            this.sendAction("saveChanges");
        }
    }
});
