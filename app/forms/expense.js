import Ember from "ember";
import Form from "splittypie/mixins/form";

const {
    computed: { oneWay },
    get,
    set,
    getProperties,
    setProperties,
    getWithDefault,
    Object: EmberObject,
} = Ember;

export default EmberObject.extend(Form, {
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
