import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("mobile-toolbar", "Integration | Component | mobile toolbar", {
    integration: true,
});

test("it renders", function (assert) {
    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });"

    this.render(hbs`{{mobile-toolbar}}`);

    assert.equal(this.$().text().trim(), "");

    // Template block usage:"
    this.render(hbs`
    {{#mobile-toolbar}}
      template block text
    {{/mobile-toolbar}}
  `);

    assert.equal(this.$().text().trim(), "template block text");
});
