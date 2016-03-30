import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";

moduleForComponent(
    "settlement-transfer-list", "Integration | Component | settlement transfer list",
    { integration: true }
);

test("it renders", function (assert) {
    const users = [
        Ember.Object.create({ name: "Bob", balance: 150 }),
        Ember.Object.create({ name: "Alice", balance: -100 }),
        Ember.Object.create({ name: "George", balance: -50 }),
    ];

    this.set("users", users);
    this.render(hbs`{{settlement-transfer-list users=users}}`);

    assert.ok(!!this.$(":contains('Alice owes Bob')").has(":contains('100')").length);
    assert.ok(!!this.$(":contains('George owes Bob')").has(":contains('50')").length);
});
