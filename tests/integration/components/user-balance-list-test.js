import EmberObject from '@ember/object';
import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

moduleForComponent("user-balance-list", "Integration | Component | user balance list", {
    integration: true,
});

test("it renders", function (assert) {
    const event = EmberObject.create({
        currency: EmberObject.create({
            code: "PLN",
        }),
    });

    const users = [
        EmberObject.create({ name: "Bob", balance: 100, event }),
        EmberObject.create({ name: "Alice", balance: -100, event }),
    ];

    this.set("users", users);
    this.render(hbs`{{user-balance-list users=users}}`);

    assert.equal(extraTrim(this.$(".user-balance-list-item").eq(0).text()), "Bob 100.00 PLN");
    assert.equal(extraTrim(this.$(".user-balance-list-item").eq(1).text()), "Alice -100.00 PLN");
});
