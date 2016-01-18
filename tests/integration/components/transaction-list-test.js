import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("transaction-list", "Integration | Component | transaction list", {
    integration: true
});

test("it renders no transactions info", function (assert) {

    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

    this.render(hbs`{{transaction-list}}`);

    assert.equal(this.$().text().trim(), "There are no transactions yet.");
});

test("it renders transaction list items", function (assert) {
    const users = [
        { name: "Bob" },
        { name: "Yuri" }
    ];
    const transactions = [
        { payer: users[0], name: "Transaction 1", amount: "200", participants: users },
        { payer: users[1], name: "Transaction 2", amount: "300", participants: users },
    ];

    this.set("transactions", transactions);
    this.render(hbs`{{transaction-list transactions=transactions}}`);

    assert.equal(this.$(".transaction-list-item").length, 2);
});
