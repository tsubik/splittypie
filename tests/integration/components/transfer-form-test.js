import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";

moduleForComponent("transfer-form", "Integration | Component | transfer form", {
    integration: true,
});

test("it renders with transfer model", function (assert) {
    assert.expect(3);

    const sender = { id: 1, name: "Bob" };
    const recipient = { id: 2, name: "Alice" };

    const transfer = Ember.Object.create({
        sender,
        recipient,
        amount: "200",
        type: "transfer",
    });

    this.set("transfer", transfer);
    this.render(hbs`{{transfer-form transfer=transfer}}`);

    assert.equal(this.$(".transfer-sender").text().trim(), "Bob", "sender");
    assert.equal(this.$(".transfer-recipient").text().trim(), "Alice", "recipient");
    assert.equal(this.$(".transfer-amount").text().trim(), "200", "amount");
});
