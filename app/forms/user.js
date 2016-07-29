import Ember from "ember";
import FormObject from "./form-object";

const {
    get,
    set,
    getProperties,
    setProperties,
} = Ember;

export default FormObject.extend({
    modelName: "user",
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 },
        },
    },

    init() {
        this._super(...arguments);
        const model = get(this, "model");

        set(this, "name", get(model, "name"));
    },

    updateModelAttributes() {
        const model = get(this, "model");

        setProperties(model, getProperties(this, "name"));
    },
});
