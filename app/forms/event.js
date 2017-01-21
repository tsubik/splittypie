import Ember from "ember";
import { validator, buildValidations } from "ember-cp-validations";

import FormObject from "./form-object";

const {
    computed: { oneWay },
    get,
    set,
    getProperties,
    setProperties,
    getWithDefault,
    Object: EmberObject,
} = Ember;

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
    innerForms: ["users"],

    isOffline: oneWay("model.isOffline"),

    init() {
        this._super(...arguments);
        const model = get(this, "model");

        setProperties(this, getProperties(model, "name", "currency"));

        const users = getWithDefault(model, "users", [])
                  .map(user => this.createInnerForm("user", user));
        set(this, "users", users);
    },

    addUser() {
        const emptyUserForm = this.createInnerForm("user", EmberObject.create());

        get(this, "users").pushObject(emptyUserForm);
    },

    updateModelAttributes() {
        const model = get(this, "model");

        setProperties(model, getProperties(this, "name", "currency"));
        set(model, "users", get(this, "users").getEach("model"));
    },
});
