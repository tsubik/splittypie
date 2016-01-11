import DS from "ember-data";
import Ember from "ember";

var Currency = DS.Model.extend({
    code: DS.attr("string"),
    symbol: DS.attr("string"),
    name: DS.attr("string"),
    nameWithCode: Ember.computed("code", "name", function () {
        return `${this.get("name")} (${this.get("code")})`;
    })
});

Currency.reopenClass({
    primaryKey: "code",
    FIXTURES: [
        { id: 1, code: "PLN", symbol:"zł", name: "złoty" },
        { id: 2, code: "GBP", symbol:"£", name: "funt szterling" },
        { id: 3, code: "USD", symbol:"$", name: "dolar amerykański" },
        { id: 4, code: "EUR", symbol:"€", name: "euro" },
        { id: 5, code: "CHF", symbol:"CHF", name: "frank szwajcarski" },
        { id: 6, code: "CZK", symbol:"Kč", name: "korona czeska" },
        { id: 7, code: "HRK", symbol:"kn", name: "kuna chorwacka" },
        { id: 8, code: "RON", symbol:"RON", name: "lej rumuński" },
        { id: 9, code: "BGN", symbol:"лв.", name: "lew bułgarski" },
        { id: 10, code: "RUB", symbol:"руб.", name: "rubel rosyjski" },
    ]
});

export default Currency;