import Ember from "ember";
import BaseForm from "splittypie/components/base-form";

const {
    computed: { alias },
} = Ember;

export default BaseForm.extend({
    formObject: alias("transfer"),
});
