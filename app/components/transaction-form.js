import Ember from "ember";

export default Ember.Component.extend({
    saveButtonText: Ember.computed("transaction.isNew", "transaction.isSaving", function () {
        const isNew = this.get("transaction.isNew");
        const isSaving = this.get("transaction.isSaving");

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create Transaction" : "Save Changes";
    }),

    actions: {
        save() {
            const transaction = this.get("transaction");

            if (transaction.updateModel()) {
                this.sendAction("modelUpdated", transaction.get("model"));
            }
        },
    },
});
