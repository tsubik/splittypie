import Ember from "ember";
import Form from "splittypie/mixins/form";

export default Ember.Object.extend(Form, {
    modelName: "transaction",
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 },
        },
        amount: {
            presence: true,
            numericality: true,
        },
        payer: {
            presence: true,
        },
        participants: {
            presence: true,
        },
    },

    event: Ember.computed.oneWay("model.event"),
    isSaving: Ember.computed.oneWay("event.isSaving"),

    init() {
        this._super(...arguments);
        const model = this.get("model");

        this.setProperties(model.getProperties("name", "date", "amount", "payer", "participants"));
        this.set("participants", model.getWithDefault("participants", []).toArray());
    },

    updateModelAttributes() {
        const model = this.get("model");

        model.setProperties(this.getProperties("name", "date", "amount", "payer", "participants"));
    },
});
