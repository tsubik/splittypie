import Ember from "ember";

export default Ember.Component.extend({
    saveButtonText: Ember.computed("transaction.isNew", "transaction.isSaving", function () {
        const isNew = this.get("transaction.isNew");
        const isSaving = this.get("transaction.isSaving");

        return isSaving ? "Saving..." : (isNew ? "Create Transaction" : "Save Changes");
    }),

    actions: {
        save() {
            const transaction = this.get("transaction");

            transaction.updateModel()
                .then((transaction) => {
                    this.sendAction("modelUpdated", transaction);
                });
        }
    }
});
