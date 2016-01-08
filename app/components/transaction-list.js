import Ember from "ember";

export default Ember.Component.extend({
    anyTransactions: Ember.computed.notEmpty("transactions"),

    actions: {
        delete(transaction) {
            if (confirm("Are you sure?")) {
                this.get("transactions").removeObject(transaction);
                this.sendAction("saveChanges");
            }
        }
    }
});
