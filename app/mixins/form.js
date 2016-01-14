import Ember from "ember";
import Validations from "ember-validations";

export default Ember.Mixin.create(Validations, {
    store: Ember.inject.service(),
    parent: null,
    isSubmitted: false,

    parentSubmittedChanged: Ember.on("init", Ember.observer("parent.isSubmitted", function () {
        this.set("isSubmitted", this.get("parent.isSubmitted"));
    })),

    formErrors: Ember.computed("isSubmitted", function () {
        return this.get("isSubmitted") ? this.errors : {};
    }),

    updateModel() {
        this.set("isSubmitted", true);

        return this.validate()
            .then(() => {
                this.createModelIfNotInStore();
                this.updateModelAttributes();
                return this.get("model");
            });
    },

    createModelIfNotInStore() {
        const modelName = this.get("modelName");

        if (this.get("model.constructor.modelName") !== modelName) {
            console.log("Form Object creating model " + modelName);
            this.set("model", this.get("store").createRecord(modelName));
        }
    }
});
