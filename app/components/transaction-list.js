import Ember from "ember";

export default Ember.Component.extend({
    anyTransactions: Ember.computed.notEmpty("transactions"),

    actions: {
        delete(transaction) {
            this.get("transactions").removeObject(transaction);
            this.sendAction("saveChanges");
        }
    }
});
