import Ember from "ember";
import Validations from "ember-validations";

export default Ember.Mixin.create(Validations, {
    container: Ember.computed.alias("model.container"),
    parent: null,
    isSubmitted: false,

    parentSubmittedChanged: Ember.on("init", Ember.observer("parent.isSubmitted", function () {
        this.set("isSubmitted", this.get("parent.isSubmitted"));
    })),

    formErrors: Ember.computed("isSubmitted", function () {
        return this.get("isSubmitted") ? this.errors : {};
    }),

    updateModel() {
        const model = this.get("model");

        this.set("isSubmitted", true);

        return this.validate()
            .then(() => this.updateModelAttributes())
            .then(() => model);
    }
});
