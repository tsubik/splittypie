import Ember from "ember";

export default Ember.Mixin.create({
    _setupCurrency(controller) {
        const currencies = this.modelFor("application").currencies;
        const event = this.modelFor("event");
        const code = event.get("currencyCode");

        controller.set("currency", currencies.findBy("code", code));
    },

    setupController(controller, model) {
        this._super(controller, model);
        this._setupCurrency(controller);
    }
});
