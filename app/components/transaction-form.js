import Ember from "ember";
import Validations from "ember-validations";
import Form from "splitr-lite/mixins/form";

export default Ember.Component.extend(Validations, Form, {
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
    }
});
