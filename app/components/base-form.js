import { inject as service } from "@ember/service";
import { get, computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    formObject: null,
    modal: service(),

    saveButtonText: computed("formObject.{isNew,isSaving}", function () {
        const isNew = get(this, "formObject.isNew");
        const isSaving = get(this, "formObject.isSaving");

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create" : "Save";
    }),

    actions: {
        save() {
            const formObject = get(this, "formObject");

            if (formObject.updateModel()) {
                this.onModelUpdated(get(formObject, "model"));
            }
        },

        delete() {
            const model = get(this, "formObject.model");

            get(this, "modal").onConfirm(
                () => this.onDelete(model)
            );
        },
    },
});
