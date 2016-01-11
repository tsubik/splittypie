import Ember from "ember";
import Form from "splitr-lite/mixins/form";

export default Ember.Component.extend(Form, {
    store: Ember.inject.service(),

    validations: {
        "event.name" : {
            presence: true,
            length: { maximum: 50 }
        }
    },

    validate() {
        const validateUsers = this.get("userList").validate();
        const validateThis = this._super.apply(this, arguments);

        return Ember.RSVP.Promise.all([validateThis, validateUsers]);
    },

    saveButtonText: Ember.computed("event.isNew", "event.isSaving", function () {
        const isNew = this.get("event.isNew");
        const isSaving = this.get("event.isSaving");

        return isSaving ? "Saving..." : (isNew ? "Create Event" : "Save Changes");
    }),

    actions: {
        addUser() {
            const event = this.get("event");
            const newUser = this.get("store").createRecord("user");

            event.get("users").pushObject(newUser);
        }
    }
});
