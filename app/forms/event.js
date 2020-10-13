import { oneWay } from "@ember/object/computed";
import EmberObject, {
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
    currency: validator("presence", true),
    users: validator("has-many"),
});

export default FormObject.extend(Validations, {
    modelName: "event",
    innerForms: ["users"], // eslint-disable-line

    isOffline: oneWay("model.isOffline"),

    init() {
        this._super(...arguments);
        const model = this.model;

        setProperties(this, getProperties(model, "name", "currency"));

        const users = getWithDefault(model, "users", [])
            .map(user => this.createInnerForm("user", user));
        set(this, "users", users);
    },

    addUser() {
        const emptyUserForm = this.createInnerForm("user", EmberObject.create());

        this.users.pushObject(emptyUserForm);
    },

    updateModelAttributes() {
        const model = this.model;

        setProperties(model, getProperties(this, "name", "currency"));
        set(model, "users", this.users.getEach("model"));
    },
});
