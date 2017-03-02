import Ember from "ember";
import { validator, buildValidations } from "ember-cp-validations";

const {
    Component,
} = Ember;

const Validations = buildValidations({
    transactionToParse: {
        validators: [
            validator("presence", true),
            validator("length", { max: 200 }),
        ],
    }
});

export default Component.extend(Validations, {
    transactionToParse: null,

    didInsertElement() {
        this.$(".transaction-parse").focus();
    },

    actions: {
        add() {

        }
    }
});
