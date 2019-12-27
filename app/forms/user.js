import {
  setProperties,
  getProperties,
  set,
  get
} from '@ember/object';
import { validator, buildValidations } from "ember-cp-validations";

import FormObject from "./form-object";

const Validations = buildValidations({
    name: {
        validators: [
            validator("presence", true),
            validator("length", { max: 50 }),
        ],
    },
});

export default FormObject.extend(Validations, {
    modelName: "user",

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
