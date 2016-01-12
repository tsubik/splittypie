import Ember from "ember";
import Form from "splitr-lite/mixins/form";
import UserForm from "splitr-lite/forms/user";

export default Ember.Object.extend(Form, {
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 }
        },
        currency: {
            presence: true
        }
    },

    name: Ember.computed.oneWay("model.name"),
    currency: Ember.computed.oneWay("model.currency"),
    users: Ember.computed.map("model.users", function (user) {
        return UserForm.create({ parent: this, model: user });
    }),
    addUser() {
        const emptyUser = Ember.Object.create({ name: "" });

        // TODO: Find better workaround for injecting container
        this.get("users").pushObject(UserForm.create({ parent: this, container: this.get("container"), model: emptyUser }));
    },

    validate() {
        const validateUsers = this.get("users").invoke("validate");
        const validateThis = this._super.apply(this, arguments);

        return Ember.RSVP.Promise.all([validateThis].concat(validateUsers));
    },

    updateModelAttributes() {
        const model = this.get("model");

        model.setProperties(this.getProperties("name", "currency"));

        this.get("users").invoke("updateModelAttributes");
    }
});
