import { inject as service } from "@ember/service";
import { setProperties, set, get } from "@ember/object";
import RSVP from "rsvp";
import Route from "@ember/routing/route";
import countryToCurrencyCode from "splittypie/utils/country-to-currency-code";

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
        return this.userCountryCode
            .getCountryCode()
            .then((countryCode) => {
                const currencyCode = countryToCurrencyCode(countryCode) || "USD";

                return this.store.findRecord("currency", currencyCode);
            });
    },

    setupController(controller, models) {
        this._super(controller, models);
        set(models.event, "currency", models.defaultCurrency);
        const eventForm = this.formFactory.createForm("event", models.event);
        setProperties(controller, {
            event: eventForm,
            currencies: models.currencies,
        });
    },

    actions: {
        modelUpdated(event) {
            this.eventRepository
                .save(event)
                .then(() => {
                    this.userContext.save(
                        get(event, "id"),
                        get(event, "users.firstObject.id")
                    );
                    this.transitionTo("event.index", event);
                });
        },
    },
});
