import Ember from "ember";
import Validations from "ember-validations";

export default Ember.Mixin.create(Validations, {
    store: Ember.inject.service(),
    formFactory: Ember.inject.service(),
    parent: null,
    isSubmitted: false,

    parentSubmittedChanged: Ember.on("init", Ember.observer("parent.isSubmitted", function () {
        this.set("isSubmitted", this.get("parent.isSubmitted"));
    })),

    formErrors: Ember.computed("isSubmitted", function () {
        return this.get("isSubmitted") ? this.errors : {};
    }),

    createInnerForm(name, model) {
        return this.get("formFactory").createForm(name, model, { parent: this });
    },

    updateModel() {
        this.set("isSubmitted", true);

        return this.validate()
            .then(() => {
                this.applyChangesToModel();
                return this.get("model");
            });
    },

    applyChangesToModel() {
        this.createModelIfNotInStore();
        this.updateModelAttributes();
    },

    createModelIfNotInStore() {
        const modelName = this.get("modelName");

        if (this.get("model.constructor.modelName") !== modelName) {
            this.set("model", this.get("store").createRecord(modelName));
        }
    },

    validate() {
        const validateThis = this._super(...arguments);
        const validateArrays = this._getObjectsToValidateFromInnerArrays().invoke("validate");

        return Ember.RSVP.Promise.all([validateThis].concat(validateArrays));
    },

    _getObjectsToValidateFromInnerArrays() {
        const validations = this.get("validations");

        return Object.keys(validations)
            .map((attributeName) => this.get(attributeName))
            .filter((value) => Ember.isArray(value))
            .reduce((prev, array) => prev.concat(array), []);
    }
});
