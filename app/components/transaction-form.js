import Ember from "ember";

export default Ember.Component.extend({
    actions: {
        save() {
            const transaction = this.get("transaction");

            transaction.updateModel().then((transaction) => {
                this.sendAction("modelUpdated", transaction);
            });
        }
    }
});
