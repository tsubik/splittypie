import Ember from "ember";
import FormComponent from "splittypie/mixins/form-component";

const {
    computed: { alias },
    Component,
} = Ember;

export default Component.extend(FormComponent, {
    formObject: alias("transfer"),
});
