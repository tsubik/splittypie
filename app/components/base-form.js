import Ember from "ember";

const {
    inject: { service },
    computed,
    get,
    Component,
} = Ember;

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
                this.sendAction("modelUpdated", get(formObject, "model"));
            }
        },

        delete() {
            const model = get(this, "formObject.model");

            get(this, "modal").onConfirm(() => this.sendAction("delete", model));
        },
    },
});
