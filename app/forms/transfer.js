import Ember from "ember";
import FormObject from "./form-object";

const {
    computed: { oneWay },
    get,
    set,
    getProperties,
    setProperties,
} = Ember;

export default FormObject.extend({
    modelName: "transaction",

    event: oneWay("model.event"),

    init() {
        this._super(...arguments);
        const model = get(this, "model");

        setProperties(this, getProperties(model, "name", "date", "amount"));
        set(this, "sender", get(model, "payer"));
        set(this, "recipient", get(model, "participants.firstObject"));
    },

    updateModelAttributes() {
        throw new Error("not-implemented");
    },
});
