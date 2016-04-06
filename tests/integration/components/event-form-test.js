import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";

moduleForComponent("event-form", "Integration | Component | event form", {
    integration: true,
});

test("it renders", function (assert) {
    assert.expect(4);

    // Template block usage:" + EOL +
    this.render(hbs`{{event-form}}`);

    assert.equal(this.$(".event-name").attr("placeholder"), "Example: Trip to Barcelona");
    assert.equal(this.$(".event-name").val(), "");
    assert.equal(this.$(".event-currency").find(":selected").val(), "");
    assert.equal(this.$(".user-name").length, 0);
});

test("it renders with model properties", function (assert) {
    assert.expect(6);
    const currencies = [
        { id: "USD", code: "USD", name: "Dolar" },
        { id: "CAD", code: "CAD", name: "Dolar kanadyjski" },
        { id: "EUR", code: "EUR", name: "Euro" },
    ];
    const event = Ember.Object.create({
        name: "Test event",
        currency: currencies[0],
        users: [
            { name: "Bob" },
            { name: "Alice" },
            { name: "John" },
        ],
    });

    this.set("event", event);
    this.set("currencies", currencies);
    this.render(hbs`{{event-form currencies=currencies event=event}}`);

    assert.equal(this.$(".event-name").val(), "Test event");
    assert.equal(this.$(".event-currency").find(":selected").val(), "USD");
    assert.equal(this.$(".user-name").length, 3);
    assert.equal(this.$(".user-name").eq(0).val(), "Bob");
    assert.equal(this.$(".user-name").eq(1).val(), "Alice");
    assert.equal(this.$(".user-name").eq(2).val(), "John");
});
