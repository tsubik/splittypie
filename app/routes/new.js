import Ember from "ember";
import countryToCurrencyCode from "splittypie/utils/country-to-currency-code";

export default Ember.Route.extend({
    userCountryCode: Ember.inject.service(),
    localStorage: Ember.inject.service(),

    model() {
        return Ember.RSVP.hash({
            defaultCurrency: this._getDefaultCurrency(),
            event: Ember.Object.create({
                users: [
                    Ember.Object.create({}),
                    Ember.Object.create({}),
                ],
            }),
            currencies: this.store.findAll("currency"),
        });
    },

    _getDefaultCurrency() {
        return this.get("userCountryCode")
            .getCountryCode()
            .then((countryCode) => {
                const currencyCode = countryToCurrencyCode(countryCode) || "USD";

                return this.store.find("currency", currencyCode);
            });
    },

    setupController(controller, models) {
        this._super(controller, models);
        models.event.set("currency", models.defaultCurrency);
        const eventForm = this.get("formFactory").createForm("event", models.event);
        controller.setProperties({
            event: eventForm,
            currencies: models.currencies,
        });
    },

    actions: {
        modelUpdated(event) {
            event.save()
                .then(() => {
                    this.get("localStorage").push(
                        "events",
                        Ember.Object.create({
                            id: event.id,
                            name: event.get("name"),
                            userId: event.get("users.firstObject.id"),
                        })
                    );
                    this.transitionTo("event.index", event);
                });
        },
    },
});
