import { alias } from "@ember/object/computed";
import { get, computed } from "@ember/object";
import BaseForm from "splittypie/components/base-form";

export default BaseForm.extend({
    formObject: alias("transaction"),

    didInsertElement() {
        if (this.formObject.isNew) {
            this.$(".transaction-name").focus();
        }
    },

    maxDate: computed(function () {
        return `${new Date().getFullYear()}-12-31`;
    }),
});
