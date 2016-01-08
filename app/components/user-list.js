import Ember from "ember";

export default Ember.Component.extend({
    anyUsers: Ember.computed.notEmpty("users"),

    isRemovingDisabled: Ember.computed.lte("users.length", 2),

    actions: {
        deleteUser(user) {
            this.get("users").removeObject(user);
            this.sendAction("saveChanges");
        },

        saveChanges() {
            this.sendAction("saveChanges");
        }
    }
});
