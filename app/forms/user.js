import Ember from "ember";
import Form from "splitr-lite/mixins/form";

export default Ember.Object.extend(Form, {
    store: Ember.inject.service(),
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 }
        }
    },

    name: Ember.computed.oneWay("model.name"),

    updateModelAttributes() {
        let model = this.get("model");

        if (model.constructor.modelName !== "user") {
            model = this.get("store").createRecord("user");
        }

        return model.setProperties(this.getProperties("name"));
    }
});
