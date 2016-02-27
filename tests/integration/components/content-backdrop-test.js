import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("content-backdrop", "Integration | Component | content backdrop", {
    integration: true,
});

test("it renders", function (assert) {
    this.render(hbs`{{content-backdrop}}`);

    assert.equal(this.$().text().trim(), "");

    // Template block usage:"
    this.render(hbs`
    {{#content-backdrop}}
      template block text
    {{/content-backdrop}}
  `);

    assert.equal(this.$().text().trim(), "template block text");
});
