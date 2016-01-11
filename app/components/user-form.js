import Ember from "ember";
import Form from "splitr-lite/mixins/form";

export default Ember.Component.extend(Form, {
    tagName: "li",

    validations: {
        "user.name": {
            presence: true,
            length: { maximum: 50 }
        }
    },

    actions: {
        delete(user) {
            this.sendAction("delete", user);
        }
    }
});
