import Ember from "ember";
import Form from "splittypie/mixins/form";

export default Ember.Object.extend(Form, {
    modelName: "transaction",

    event: Ember.computed.oneWay("model.event"),

    init() {
        this._super(...arguments);
        const model = this.get("model");

        this.setProperties(model.getProperties("name", "date", "amount"));
        this.set("sender", model.get("payer"));
        this.set("recipient", model.get("participants.firstObject"));
    },

    updateModelAttributes() {
        throw new Error("not-implemented");
    },
});
