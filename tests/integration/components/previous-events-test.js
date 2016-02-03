import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("previous-events", "Integration | Component | previous events", {
    integration: true,
});

test("it renders", function (assert) {
    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

    this.render(hbs`{{previous-events}}`);

    assert.equal(this.$().text().trim(), "");

    // Template block usage:" + EOL +
    this.render(hbs`
    {{#previous-events}}
      template block text
    {{/previous-events}}
  `);

    assert.equal(this.$().text().trim(), "template block text");
});
