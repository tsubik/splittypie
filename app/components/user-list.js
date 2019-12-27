import { lte } from "@ember/object/computed";
import { get } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    tagName: "ul",
    classNames: ["list-unstyled"],

    isRemoveDisabled: lte("users.length", 2),

    // validate() {
    //     const validateUsers = get(this, "users").getEach("form").invoke("validate");
    //     const validateThis = this._super.apply(this, arguments);

    //     return Promise.all([validateThis].concat(validateUsers));
    // },

    actions: {
        deleteUser(user) {
            get(this, "users").removeObject(user);
        },
    },
});
