import Ember from "ember";

export default Ember.Component.extend({
    tagName: "li",

    actions: {
        delete(user) {
            this.sendAction("delete", user);
        }
    }
});
