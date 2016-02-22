import DS from "ember-data";
import Ember from "ember";

const Currency = DS.Model.extend({
    code: Ember.computed.alias("id"),
    symbol: DS.attr("string"),
    name: DS.attr("string"),
    nameWithCode: Ember.computed("code", "name", function () {
        return `${this.get("name")} (${this.get("code")})`;
    }),
});

Currency.reopenClass({
    FIXTURES: [
        { id: "USD", symbol: "$", name: "United States dollar" },
        { id: "EUR", symbol: "€", name: "Euro" },
        { id: "GBP", symbol: "£", name: "Pound sterling" },
        { id: "PLN", symbol: "zł", name: "Polish złoty" },
        { id: "CHF", symbol: "CHF", name: "Swiss franc" },
        { id: "CZK", symbol: "Kč", name: "Czech koruna" },
        { id: "HRK", symbol: "kn", name: "Croatian kuna" },
        { id: "RON", symbol: "RON", name: "Romanian leu" },
        { id: "BGN", symbol: "лв.", name: "Bulgarian lev" },
        { id: "RUB", symbol: "руб.", name: "Russian ruble" },
    ],
});

export default Currency;
