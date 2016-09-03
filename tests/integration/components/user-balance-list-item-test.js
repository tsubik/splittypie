import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

moduleForComponent("user-balance-list-item", "Integration | Component | user balance list item", {
    integration: true,
});

test("it renders", function (assert) {
    const user = {
        id: 1,
        name: "Tomasz",
        balance: 123,
        event: {
            currency: { code: "PLN" },
        },
    };

    this.set("user", user);
    this.render(hbs`{{user-balance-list-item user=user}}`);

    assert.equal(extraTrim(this.$().text()), "Tomasz 123.00 PLN", "proper text content");
    assert.ok(this.$("tr span").hasClass("label-success"), "success class for positive balance");
});
