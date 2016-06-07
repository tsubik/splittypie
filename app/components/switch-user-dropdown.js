import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["dropdown", "user-dropdown"],

    otherUsers: Ember.computed("selected", "users", function () {
        const users = this.get("users");
        const currentUser = this.get("selected");

        return users.rejectBy("id", currentUser.get("id"));
    }),

    actions: {
        switchUser(user) {
            this.sendAction("action", user);
        },
    },
});
