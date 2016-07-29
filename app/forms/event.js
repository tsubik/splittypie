import Ember from "ember";
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

export default FormObject.extend({
    modelName: "event",
    innerForms: ["users"],

    isOffline: oneWay("model.isOffline"),

    validations: {
        name: {
            presence: true,
            length: { maximum: 50 },
        },
        currency: {
            presence: true,
        },
        users: {
            array: true,
        },
    },

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
