import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("switch-user-dropdown", "Integration | Component | switch user dropdown", {
    integration: true,
});

test("it renders", function (assert) {
    this.render(hbs`{{switch-user-dropdown}}`);

    assert.equal(this.$().text().trim(), "");
});
