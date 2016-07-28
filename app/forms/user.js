import Ember from "ember";
import Form from "splittypie/mixins/form";

const {
    get,
    set,
    getProperties,
    setProperties,
    Object: EmberObject,
} = Ember;

export default EmberObject.extend(Form, {
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
