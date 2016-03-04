import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("side-menu", "Integration | Component | side menu", {
    integration: true,
});

test("it renders", function (assert) {
    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

    this.render(hbs`{{side-menu}}`);

    assert.equal(this.$().text().trim(), "");

    // Template block usage:" + EOL +
    this.render(hbs`
    {{#side-menu}}
      template block text
    {{/side-menu}}
  `);

    assert.equal(this.$().text().trim(), "template block text");
});
