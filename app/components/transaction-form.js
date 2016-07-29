import Ember from "ember";
import BaseForm from "splittypie/components/base-form";

const {
    computed: { alias },
    computed,
    get,
} = Ember;

export default BaseForm.extend({
    formObject: alias("transaction"),

    didInsertElement() {
        if (get(this, "formObject.isNew")) {
            this.$(".transaction-name").focus();
        }
    },

    maxDate: computed(function () {
        return `${new Date().getFullYear()}-12-31`;
    }),
});
