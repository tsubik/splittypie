import Ember from "ember";
import FormComponent from "splittypie/mixins/form-component";

export default Ember.Component.extend(FormComponent, {
    formObject: Ember.computed.alias("transaction"),

    didInsertElement() {
        this.$(".transaction-name").focus();
    },

    maxDate: function () {
        return `${new Date().getFullYear()}-12-31`;
    }.property(),
});
