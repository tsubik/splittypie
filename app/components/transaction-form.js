import Ember from "ember";
import Validations from "ember-validations";

export default Ember.Component.extend(Validations, {
    validations: {
        "transaction.name": {
            presence: true,
            length: { maximum: 50 }
        },
        "transaction.amount": {
            presence: true,
            numericality: true
        },
        "transaction.payer": {
            presence: true
        },
        "transaction.participants": {
            presence: true
        }
    },

    formErrors: Ember.computed("isSubmitted", function () {
        return this.get("isSubmitted") ? this.errors : {};
    }),

    actions: {
        save() {
            this.set("isSubmitted", true);
            this.validate()
                .then(() => this.sendAction("save"));
        }
    }
});
