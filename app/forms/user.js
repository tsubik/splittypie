import Ember from "ember";
import Form from "splitr-lite/mixins/form";

export default Ember.Object.extend(Form, {
    modelName: "user",
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 },
        },
    },

    init() {
        this._super(...arguments);
        const model = this.get("model");

        this.set("name", model.get("name"));
    },

    updateModelAttributes() {
        const model = this.get("model");

        model.setProperties(this.getProperties("name"));
    },
});
