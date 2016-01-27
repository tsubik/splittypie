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

        if (this.get("isValid")) {
            this.applyChangesToModel();
            return true;
        }

        return false;
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

    _getInnerForms() {
        const innerForms = this.getWithDefault("innerForms", []);

        return innerForms
            .map((attribute) => this.get(attribute))
            .flatten();
    },
});
