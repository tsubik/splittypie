import Ember from "ember";
import Form from "splittypie/mixins/form";

const {
    computed: { oneWay },
    get,
    set,
    getProperties,
    setProperties,
    Object: EmberObject,
} = Ember;

export default EmberObject.extend(Form, {
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
