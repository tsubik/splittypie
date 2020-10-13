import { oneWay } from "@ember/object/computed";
import {
  setProperties,
  getProperties,
  set,
  get
} from "@ember/object";
import FormObject from "./form-object";

export default FormObject.extend({
    modelName: "transaction",

    event: oneWay("model.event"),

    init() {
        this._super(...arguments);
        const model = this.model;

        setProperties(this, getProperties(model, "name", "date", "amount"));
        set(this, "sender", get(model, "payer"));
        set(this, "recipient", get(model, "participants.firstObject"));
    },

    updateModelAttributes() {
        throw new Error("not-implemented");
    },
});
