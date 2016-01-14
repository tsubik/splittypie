import Ember from "ember";
import Form from "splitr-lite/mixins/form";
import { injectForms } from "splitr-lite/utils/inject";

export default Ember.Object.extend(Form, {
    userForm: injectForms("user"),
    modelName: "event",
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 }
        },
        currency: {
            presence: true
        }
    },

    init() {
        this._super(...arguments);
        const model = this.get("model");

        this.setProperties(model.getProperties("name", "currency"));

        this.set("users", model.getWithDefault("users", []).map((user) => {
            return this.get("userForm").create({ parent: this, model: user });
        }));
    },

    addUser() {
        const emptyUserForm = this.get("userForm").create({ parent: this, model: Ember.Object.create() });

        this.get("users").pushObject(emptyUserForm);
    },

    validate() {
        const validateUsers = this.get("users").invoke("validate");
        const validateThis = this._super.apply(this, arguments);

        return Ember.RSVP.Promise.all([validateThis].concat(validateUsers));
    },

    updateModelAttributes() {
        const model = this.get("model");

        model.setProperties(this.getProperties("name", "currency"));
        this.get("users").invoke("createModelIfNotInStore");
        this.get("users").invoke("updateModelAttributes");
        model.set("users", this.get("users").getEach("model"));
    }
});
