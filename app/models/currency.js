import { alias } from "@ember/object/computed";
import { get, computed } from "@ember/object";
import Model from "ember-data/model";
import attr from "ember-data/attr";

const Currency = Model.extend({
    code: alias("id"),
    symbol: attr("string"),
    name: attr("string"),
    nameWithCode: computed("code", "name", function () {
        return `${get(this, "name")} (${get(this, "code")})`;
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
