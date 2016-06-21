import Ember from "ember";
import FormComponent from "splittypie/mixins/form-component";

export default Ember.Component.extend(FormComponent, {
    formObject: Ember.computed.alias("transfer"),
});
