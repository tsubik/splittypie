import countryToCurrencyCode from "splittypie/utils/country-to-currency-code";
import { module, test } from "qunit";

module("Unit | Utility | country to currency code");

// Replace this with your real tests.
test("it works", function (assert) {
    assert.equal(countryToCurrencyCode("PL"), "PLN");
    assert.equal(countryToCurrencyCode("DE"), "EUR");
    assert.equal(countryToCurrencyCode("US"), "USD");
    assert.equal(countryToCurrencyCode("RU"), "RUB");
    assert.equal(countryToCurrencyCode("IT"), "EUR");
    // other
    assert.equal(countryToCurrencyCode("ZA"), undefined);
});
