import Ember from "ember";

export default Ember.Component.extend({
    store: Ember.inject.service(),
    isSubmitted: Ember.computed.oneWay("event.isSubmitted"),

    cancelRouteName: Ember.computed("event.isNew", function () {
        const isNew = this.get("event.isNew");

        return isNew ? "index" : "event.index";
    }),

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

        save() {
            const event = this.get("event");

            if (event.updateModel()) {
                this.sendAction("modelUpdated", event.get("model"));
            }
        },
    },
});
