import Ember from "ember";
import Form from "splitr-lite/mixins/form";

export default Ember.Object.extend(Form, {
    modelName: "event",
    innerForms: ["users"],
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 }
        },
        currency: {
            presence: true
        },
        users: true
    },

    init() {
        this._super(...arguments);
        const model = this.get("model");

        this.setProperties(model.getProperties("name", "currency"));

        this.set("users", model.getWithDefault("users", []).map((user) => {
            return this.createInnerForm("user", user);
        }));
    },

    addUser() {
        const emptyUserForm = this.createInnerForm("user", Ember.Object.create());

        this.get("users").pushObject(emptyUserForm);
    },

    updateModelAttributes() {
        const model = this.get("model");

        model.setProperties(this.getProperties("name", "currency"));
        model.set("users", this.get("users").getEach("model"));
    }
});
