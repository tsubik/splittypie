import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    formObject: null,
    modal: service(),

    saveButtonText: computed("formObject.{isNew,isSaving}", function () {
        const isNew = this.formObject.isNew;
        const isSaving = this.formObject.isSaving;

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create" : "Save";
    }),

    actions: {
        save() {
            const formObject = this.formObject;

            if (formObject.updateModel()) {
                this.onModelUpdated(formObject.model);
            }
        },

        delete() {
            const model = this.formObject.model;

            this.modal.onConfirm(
                () => this.onDelete(model)
            );
        },
    },
});
