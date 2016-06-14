import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("scroll-to", "Integration | Component | scroll to", {
    integration: true,
});

test("it renders", function (assert) {
    this.render(hbs`{{scroll-to}}`);

    assert.equal(this.$().text().trim(), "");

    // Template block usage:
    this.render(hbs`
    {{#scroll-to}}
      template block text
    {{/scroll-to}}
  `);

    assert.equal(this.$().text().trim(), "template block text");
});
