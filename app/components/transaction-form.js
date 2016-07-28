import Ember from "ember";
import FormComponent from "splittypie/mixins/form-component";

const {
    computed: { alias },
    computed,
    get,
    Component,
} = Ember;

export default Component.extend(FormComponent, {
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
