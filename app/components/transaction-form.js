import Ember from "ember";

export default Ember.Component.extend({
    modal: Ember.inject.service(),

    saveButtonText: Ember.computed("transaction.isNew", "transaction.isSaving", function () {
        const isNew = this.get("transaction.isNew");
        const isSaving = this.get("transaction.isSaving");

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create Transaction" : "Save Changes";
    }),

    actions: {
        delete(transaction) {
            this.get("modal").trigger("show", {
                name: "confirm",
                actions: {
                    ok: () => {
                        this.sendAction("delete", transaction);
                        this.get("modal").trigger("hide");
                    },
                },
            });
        },

        save() {
            const transaction = this.get("transaction");

            if (transaction.updateModel()) {
                this.sendAction("modelUpdated", transaction.get("model"));
            }
        },
    },
});
