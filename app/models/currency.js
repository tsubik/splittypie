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
        { id: "PLN", symbol: "zł", name: "złoty" },
        { id: "GBP", symbol: "£", name: "funt szterling" },
        { id: "USD", symbol: "$", name: "dolar amerykański" },
        { id: "EUR", symbol: "€", name: "euro" },
        { id: "CHF", symbol: "CHF", name: "frank szwajcarski" },
        { id: "CZK", symbol: "Kč", name: "korona czeska" },
        { id: "HRK", symbol: "kn", name: "kuna chorwacka" },
        { id: "RON", symbol: "RON", name: "lej rumuński" },
        { id: "BGN", symbol: "лв.", name: "lew bułgarski" },
        { id: "RUB", symbol: "руб.", name: "rubel rosyjski" },
    ],
});

export default Currency;
