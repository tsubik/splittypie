import Ember from "ember";

export default Ember.Mixin.create({
    formObject: null,
    modal: Ember.inject.service(),

    saveButtonText: Ember.computed("formObject.isNew", "formObject.isSaving", function () {
        const isNew = this.get("formObject.isNew");
        const isSaving = this.get("formObject.isSaving");

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create" : "Save";
    }),

    actions: {
        save() {
            const formObject = this.get("formObject");

            if (formObject.updateModel()) {
                this.sendAction("modelUpdated", formObject.get("model"));
            }
        },

        delete() {
            const model = this.get("formObject.model");

            this.get("modal").onConfirm(() => this.sendAction("delete", model));
        },
    },
});
