import Ember from "ember";
import Form from "splittypie/mixins/form";

const {
    computed: { lte },
    RSVP: { Promise },
    get,
    Component,
} = Ember;

export default Component.extend(Form, {
    tagName: "ul",
    classNames: ["list-unstyled"],

    isRemoveDisabled: lte("users.length", 2),

    validate() {
        const validateUsers = get(this, "users").getEach("form").invoke("validate");
        const validateThis = this._super.apply(this, arguments);

        return Promise.all([validateThis].concat(validateUsers));
    },

    actions: {
        deleteUser(user) {
            get(this, "users").removeObject(user);
        },
    },
});
