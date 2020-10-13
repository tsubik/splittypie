import { oneWay } from "@ember/object/computed";
import {
  getWithDefault,
  setProperties,
  getProperties,
  set,
  get
} from "@ember/object";
import { validator, buildValidations } from "ember-cp-validations";

import FormObject from "./form-object";

const Validations = buildValidations({
    name: {
        validators: [
            validator("presence", true),
            validator("length", { max: 50 }),
        ],
    },
    amount: {
        validators: [
            validator("presence", true),
            validator("number", { allowString: true }),
        ],
    },
    payer: validator("presence", true),
    participants: validator("presence", true),
});

export default FormObject.extend(Validations, {
    modelName: "transaction",

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
