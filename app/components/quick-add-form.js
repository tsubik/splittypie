import { oneWay, not } from "@ember/object/computed";
import EmberObject, { get, computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { validator, buildValidations } from "ember-cp-validations";
import parseTransaction from "splittypie/utils/parse-transaction";

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

    currency: oneWay("event.currency"),
    event: oneWay("payer.event"),
    invalidAmount: not("validations.attrs.transaction.amount.isValid"),
    invalidName: not("validations.attrs.transaction.name.isValid"),
    isFormInvalid: not("validations.isValid"),
    participants: oneWay("event.users"),
    payer: oneWay("userContext.currentUser"),
    transactionToParse: null,

    transaction: computed("transactionToParse", function () {
        const event = get(this, "event");
        const transactionToParse = get(this, "transactionToParse");
        const transactionProps = parseTransaction(transactionToParse);
        const payer = get(this, "payer");
        let participants = get(this, "participants");

        if (transactionProps && get(transactionProps, "onlyMe")) {
            participants = [payer];
        }

        return EmberObject.create({
            ...transactionProps,
            event,
            payer,
            participants
        });
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
            const transactionProps = get(this, "transaction");

            if (typeof onAddWithDetails !== "function") return;

            onAddWithDetails(transactionProps);
        }
    }
});
