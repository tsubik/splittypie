import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("user-list", "Integration | Component | user list", {
    integration: true
});

test("it renders", function (assert) {
    this.render(hbs`{{user-list}}`);

    assert.equal(this.$().text().trim(), "");
});

test("it renders user forms", function (assert) {
    const users = [
        { name: "Bob" },
        { name: "Yuri" }
    ];

    this.set("users", users);
    this.render(hbs`{{user-list users=users}}`);

    assert.equal(this.$(".user-form").length, 2);
});
