import Ember from "ember";

export default Ember.Component.extend({
    modal: Ember.inject.service(),
    store: Ember.inject.service(),
    isSubmitted: Ember.computed.oneWay("event.isSubmitted"),

    saveButtonText: Ember.computed("event.isNew", "event.isSaving", function () {
        const isNew = this.get("event.isNew");
        const isSaving = this.get("event.isSaving");

        if (isSaving) {
            return "Saving...";
        }

        return isNew ? "Create" : "Save";
    }),

    actions: {
        addUser() {
            const event = this.get("event");

            event.addUser();
        },

        delete() {
            const event = this.get("event.model");

            this.get("modal").onConfirm(() => this.sendAction("delete", event));
        },

        save() {
            const event = this.get("event");

            if (event.updateModel()) {
                this.sendAction("modelUpdated", event.get("model"));
            }
        },
    },
});
