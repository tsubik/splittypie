import Ember from "ember";

export default Ember.Component.extend({
    modal: Ember.inject.service(),

    saveButtonText: Ember.computed("transaction.isNew", "transaction.isSaving", function () {
        const isNew = this.get("transaction.isNew");
        const isSaving = this.get("transaction.isSaving");

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create" : "Save";
    }),

    maxDate: function () {
        return `${new Date().getFullYear()}-12-31`;
    }.property(),

    actions: {
        delete() {
            const transaction = this.get("transaction.model");

            this.get("modal").onConfirm(() => this.sendAction("delete", transaction));
        },

        goBack() {
            window.history.back();
        },

        save() {
            const form = this.get("transaction");

            if (form.updateModel()) {
                this.sendAction("modelUpdated", form.get("model"));
            }
        },
    },
});
