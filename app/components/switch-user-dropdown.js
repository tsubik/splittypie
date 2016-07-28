import Ember from "ember";

const {
    computed,
    get,
    Component,
} = Ember;

export default Component.extend({
    tagName: "div",
    classNames: ["dropdown", "user-dropdown"],

    otherUsers: computed("selected", "users", function () {
        const users = get(this, "users");
        const currentUser = get(this, "selected");

        return users.rejectBy("id", get(currentUser, "id"));
    }),

    actions: {
        switchUser(user) {
            this.sendAction("action", user);
        },
    },
});
