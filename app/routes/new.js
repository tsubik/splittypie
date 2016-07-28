import Ember from "ember";
import countryToCurrencyCode from "splittypie/utils/country-to-currency-code";

const {
    inject: { service },
    get,
    set,
    setProperties,
    RSVP,
    Route,
} = Ember;

export default Route.extend({
    userCountryCode: service(),
    userContext: service(),
    eventRepository: service(),

    model() {
        // FIXME: Don't like this model building
        return RSVP.hash({
            defaultCurrency: this._getDefaultCurrency(),
            event: {
                users: [{}, {}],
            },
            currencies: this.store.findAll("currency"),
        });
    },

    _getDefaultCurrency() {
        return get(this, "userCountryCode")
            .getCountryCode()
            .then((countryCode) => {
                const currencyCode = countryToCurrencyCode(countryCode) || "USD";

                return this.store.findRecord("currency", currencyCode);
            });
    },

    setupController(controller, models) {
        this._super(controller, models);
        set(models.event, "currency", models.defaultCurrency);
        const eventForm = get(this, "formFactory").createForm("event", models.event);
        setProperties(controller, {
            event: eventForm,
            currencies: models.currencies,
        });
    },

    actions: {
        modelUpdated(event) {
            get(this, "eventRepository")
                .save(event)
                .then(() => {
                    get(this, "userContext").save(
                        get(event, "id"),
                        get(event, "users.firstObject.id")
                    );
                    this.transitionTo("event.index", event);
                });
        },
    },
});
