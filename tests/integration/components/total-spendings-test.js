import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";

moduleForComponent("total-spendings", "Integration | Component | total spendings", {
    integration: true,
});

test("it renders properly", function (assert) {
    const event = Ember.Object.create({
        name: "Test event",
        currency: Ember.Object.create({
            code: "USD",
        }),
        transactions: [
            Ember.Object.create({ amount: 50 }),
            Ember.Object.create({ amount: 25 }),
        ],
    });
    this.set("event", event);

    this.render(hbs`{{total-spendings}}`);

    assert.equal(this.$().text().trim(), "");

    this.render(hbs`{{total-spendings event=event}}`);

    assert.equal(this.$().text().trim(), "Total spendings: 75 USD");
});
