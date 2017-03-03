import Ember from "ember";
import { validator, buildValidations } from "ember-cp-validations";
import parseTransaction from "splittypie/utils/parse-transaction";

const {
    computed,
    computed: { not, oneWay },
    get,
    inject: { service },
    Component,
} = Ember;

const Validations = buildValidations({
    transactionToParse: {
        validators: [
            validator("presence", true),
            validator("length", { max: 200 }),
        ],
    },
    "transaction.name": {
        validators: [
            validator("presence", true),
            validator("length", { max: 50 }),
        ],
    },
    "transaction.amount": {
        validators: [
            validator("presence", true),
            validator("number", { allowString: true }),
        ],
    }
});

export default Component.extend(Validations, {
    userContext: service(),

    currency: oneWay("userContext.currentUser.event.currency"),
    transactionToParse: null,
    isFormInvalid: not("validations.isValid"),
    invalidName: not("validations.attrs.transaction.name.isValid"),
    invalidAmount: not("validations.attrs.transaction.amount.isValid"),

    transaction: computed("transactionToParse", function () {
        const transactionToParse = get(this, "transactionToParse");
        return parseTransaction(transactionToParse);
    }),

    didInsertElement() {
        // timeout workaround - wait until modal show animation is over
        setTimeout(() => {
            this.$(".transaction-parse").focus();
        }, 500);
    },

    actions: {
        add() {
            const isFormInvalid = get(this, "isFormInvalid");
            const transactionProps = get(this, "transaction");
            const onAdd = get(this, "onAdd");

            if (isFormInvalid) return;
            if (typeof onAdd !== "function") return;

            onAdd(transactionProps);
        },

        addWithDetails() {
            const onAddWithDetails = get(this, "onAddWithDetails");

            if (typeof onAddWithDetails !== "function") return;

            onAddWithDetails();
        }
    }
});
