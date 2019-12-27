import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import EmberObject, {
  observer,
  getWithDefault,
  set,
  get,
  computed
} from '@ember/object';
import DS from "ember-data";

export default EmberObject.extend({
    store: service(),
    formFactory: service(),
    parent: null,
    model: null,
    isSubmitted: false,

    isModelEmberDataModel: computed("model", function () {
        return DS.Model.detectInstance(this.get("model"));
    }),
    isSaving: oneWay("model.isSaving"),
    isNew: computed("isModelEmberDataModel", "model.isNew", function () {
        return get(this, "isModelEmberDataModel") ? get(this, "model.isNew") : true;
    }),

    parentSubmittedChanged: on("init", observer("parent.isSubmitted", function () {
        set(this, "isSubmitted", get(this, "parent.isSubmitted"));
    })),

    formErrors: computed("isSubmitted", function () {
        return get(this, "isSubmitted") ? get(this, "validations.attrs") : {};
    }),

    createInnerForm(name, model) {
        return get(this, "formFactory").createForm(name, model, { parent: this });
    },

    updateModel() {
        set(this, "isSubmitted", true);

        if (get(this, "validations.isValid")) {
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
        if (!get(this, "isModelEmberDataModel")) {
            set(this, "model", get(this, "store").createRecord(get(this, "modelName")));
        }
    },

    updateInnerForms() {
        this._getInnerForms().invoke("applyChangesToModel");
    },

    updateModelAttributes() {},

    _getInnerForms() {
        const innerForms = getWithDefault(this, "innerForms", []);

        return innerForms
            .map(attribute => get(this, attribute))
            .flatten();
    },
});
