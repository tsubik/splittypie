import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("user-form", "Integration | Component | user form", {
    integration: true
});

test("it renders", function (assert) {
    this.render(hbs`{{user-form}}`);

    assert.equal(this.$(".user-name").val(), "");
});

test("it renders with user model", function (assert) {
    const user = {
        name: "John"
    };

    this.set("user", user);
    this.render(hbs`{{user-form user=user}}`);

    assert.equal(this.$(".user-name").val(), "John");
});
