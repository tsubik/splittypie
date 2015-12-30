import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";

moduleForComponent("user-balance-list", "Integration | Component | user balance list", {
    integration: true
});

test("it renders", function(assert) {
    const users = [
        Ember.Object.create({name: "Bob", balance: 100}),
        Ember.Object.create({name: "Alice", balance: -100})
    ];

    this.set("users", users);
    this.render(hbs`{{user-balance-list users=users}}`);

    assert.equal(this.$(".user-balance-list-item").eq(0).text().trim().replace(/(\r\n|\n|\r)/g, " ").replace(/\s+/g, " "), "Bob 100");
    assert.equal(this.$(".user-balance-list-item").eq(1).text().trim().replace(/(\r\n|\n|\r)/g, " ").replace(/\s+/g, " "), "Alice -100");
});
