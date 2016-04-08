import Ember from "ember";

export default Ember.Component.extend({
    tagName: "li",
    classNames: ["user-form"],
    placeholder: Ember.computed("index", function () {
        const index = this.get("index");

        return index === 0 ? "Your name" : "Your friend's name";
    }),

    actions: {
        delete(user) {
            this.sendAction("delete", user);
        },
    },
});
