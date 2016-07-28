import Ember from "ember";
import Validations from "ember-validations";
import DS from "ember-data";

const {
    inject: { service },
    computed: { oneWay },
    computed,
    get,
    set,
    getWithDefault,
    observer,
    on,
    Mixin,
} = Ember;

export default Mixin.create(Validations, {
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
        return get(this, "isSubmitted") ? this.errors : {};
    }),

    createInnerForm(name, model) {
        return get(this, "formFactory").createForm(name, model, { parent: this });
    },

    updateModel() {
        set(this, "isSubmitted", true);

        if (get(this, "isValid")) {
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
            .map((attribute) => get(this, attribute))
            .flatten();
    },
});
