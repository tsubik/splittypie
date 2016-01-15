import Ember from "ember";
import Validations from "ember-validations";
import DS from "ember-data";

export default Ember.Mixin.create(Validations, {
    store: Ember.inject.service(),
    formFactory: Ember.inject.service(),
    parent: null,
    model: null,
    isSubmitted: false,

    isModelEmberDataModel: function () {
        return DS.Model.detectInstance(this.get("model"));
    }.property(),
    isSaving: Ember.computed.oneWay("model.isSaving"),
    isNew: function () {
        return this.get("isModelEmberDataModel") ? this.get("model.isNew") : true;
    }.property(),

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

    validate() {
        const validateThis = this._super(...arguments);
        const validateArrays = this._getObjectsToValidateFromInnerArrays().invoke("validate");

        return Ember.RSVP.Promise.all([validateThis].concat(validateArrays));
    },

    applyChangesToModel() {
        this.createModelIfNotEmberDataModel();
        this.updateInnerForms();
        this.updateModelAttributes();
    },

    createModelIfNotEmberDataModel() {
        if (!this.get("isModelEmberDataModel")) {
            this.set("model", this.get("store").createRecord(this.get("modelName")));
        }
    },

    updateInnerForms() {
        this._getInnerForms().invoke("applyChangesToModel");
    },

    updateModelAttributes() {},

    // Ember validations somehow doesn't validate objects in arrays
    _getObjectsToValidateFromInnerArrays() {
        const validations = this.get("validations");

        return Object.keys(validations)
            .map((attributeName) => this.get(attributeName))
            .filter((value) => Ember.isArray(value))
            .flatten();
    },
    _getInnerForms() {
        const innerForms = this.getWithDefault("innerForms", []);

        return innerForms
            .map((attribute) => this.get(attribute))
            .flatten();
    }
});
