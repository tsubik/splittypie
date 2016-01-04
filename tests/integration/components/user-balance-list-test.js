import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";
import extraTrim from "../../helpers/extra-trim";

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

    assert.equal(extraTrim(this.$(".user-balance-list-item").eq(0).text()), "Bob 100");
    assert.equal(extraTrim(this.$(".user-balance-list-item").eq(1).text()), "Alice -100");
});
