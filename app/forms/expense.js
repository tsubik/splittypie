import Ember from "ember";
import FormObject from "./form-object";

const {
    computed: { oneWay },
    get,
    set,
    getProperties,
    setProperties,
    getWithDefault,
} = Ember;

export default FormObject.extend({
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

    event: oneWay("model.event"),
    isSaving: oneWay("event.isSaving"),

    init() {
        this._super(...arguments);
        const model = get(this, "model");

        setProperties(
            this,
            getProperties(model, "name", "isTransfer", "date", "amount", "payer", "participants")
        );
        set(this, "participants", getWithDefault(model, "participants", []).toArray());
    },

    updateModelAttributes() {
        const model = get(this, "model");

        setProperties(
            model,
            getProperties(this, "name", "date", "amount", "payer", "participants")
        );
    },
});
