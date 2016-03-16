import Ember from "ember";
import Form from "splittypie/mixins/form";

export default Ember.Component.extend(Form, {
    tagName: "ul",
    classNames: ["list-unstyled"],

    isRemoveDisabled: Ember.computed.lte("users.length", 2),

    validate() {
        const validateUsers = this.get("users").getEach("form").invoke("validate");
        const validateThis = this._super.apply(this, arguments);

        return Ember.RSVP.Promise.all([validateThis].concat(validateUsers));
    },

    actions: {
        deleteUser(user) {
            this.get("users").removeObject(user);
        },
    },
});
