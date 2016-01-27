import Ember from "ember";

export default Ember.Component.extend({
    tagName: "li",
    classNames: ["user-form"],

    actions: {
        delete(user) {
            this.sendAction("delete", user);
        },
    },
});
