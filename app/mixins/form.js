import Ember from "ember";
import Validations from "ember-validations";

export default Ember.Mixin.create(Validations, {
    isSubmitted: false,

    formErrors: Ember.computed("isSubmitted", function () {
        return this.get("isSubmitted") ? this.errors : {};
    }),

    _register: Ember.on("init", function () {
        Ember.run.schedule("afterRender", this, () => {
            this.set("registerAs", this);
        });
    }),

    actions: {
        save() {
            this.set("isSubmitted", true);
            this.validate()
                .then(() => this.sendAction("save"));
        }
    }
});
