import Ember from "ember";
import countryToCurrencyCode from "splittypie/utils/country-to-currency-code";

const { service } = Ember.inject;

export default Ember.Route.extend({
    userCountryCode: service(),
    userContext: service(),
    eventRepository: service(),

    model() {
        // FIXME: Don't like this model building
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

                return this.store.findRecord("currency", currencyCode);
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
            this.get("eventRepository")
                .save(event)
                .then(() => {
                    this.get("userContext").save(
                        event.get("id"),
                        event.get("users.firstObject.id")
                    );
                    this.transitionTo("event.index", event);
                });
        },
    },
});
