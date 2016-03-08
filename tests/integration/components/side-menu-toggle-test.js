import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("side-menu-toggle", "Integration | Component | side menu toggle", {
    integration: true,
});

test("it renders", function (assert) {
    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });"

    this.render(hbs`{{side-menu-toggle}}`);

    assert.equal(this.$().text().trim(), "");
});
