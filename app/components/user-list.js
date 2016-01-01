import Ember from "ember";

export default Ember.Component.extend({
    anyUsers: Ember.computed.notEmpty("users"),

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
