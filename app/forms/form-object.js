import Model from '@ember-data/model';
import { inject as service } from "@ember/service";
import { oneWay } from "@ember/object/computed";
import { on } from "@ember/object/evented";
import EmberObject, {
    observer,
    set,
    get,
    computed
} from "@ember/object";

export default EmberObject.extend({
    store: service(),
    formFactory: service(),
    parent: null,
    model: null,
    isSubmitted: false,

    isModelEmberDataModel: computed("model", function () {
        return Model.detectInstance(this.model);
    }),
    isSaving: oneWay("model.isSaving"),
    isNew: computed("isModelEmberDataModel", "model.isNew", function () {
        return this.isModelEmberDataModel ? this.model.isNew : true;
    }),

    parentSubmittedChanged: on("init", observer("parent.isSubmitted", function () {
        set(this, "isSubmitted", get(this, "parent.isSubmitted"));
    })),

    formErrors: computed("isSubmitted", function () {
        return this.isSubmitted ? this.validations.attrs : {};
    }),

    createInnerForm(name, model) {
        return this.formFactory.createForm(name, model, { parent: this });
    },

    updateModel() {
        set(this, "isSubmitted", true);

        if (this.validations.isValid) {
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
        if (!this.isModelEmberDataModel) {
            set(this, "model", this.store.createRecord(this.modelName));
        }
    },

    updateInnerForms() {
        this._getInnerForms().invoke("applyChangesToModel");
    },

    updateModelAttributes() {},

    _getInnerForms() {
        const innerForms = this.innerForms || [];

        return innerForms
            .map(attribute => this[attribute])
            .flatten();
    },
});
