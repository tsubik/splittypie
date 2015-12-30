import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";

moduleForComponent("settlement-transfer-list", "Integration | Component | settlement transfer list", {
    integration: true
});

test("it renders", function(assert) {
    const users = [
        Ember.Object.create({name: "Bob", balance: 150}),
        Ember.Object.create({name: "Alice", balance: -100}),
        Ember.Object.create({name: "George", balance: -50})
    ];

    this.set("users", users);
    this.render(hbs`{{settlement-transfer-list users=users}}`);

    assert.ok(this.$(".settlement-item:contains('Alice has to send Bob 100')").length);
    assert.ok(this.$(".settlement-item:contains('George has to send Bob 50')").length);
});
