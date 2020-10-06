import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | modal dialog", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      // Set any properties with this.set("myProperty", "value");
      // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

      await render(hbs`{{modal-dialog}}`);

      assert.equal(find('*').textContent.trim(), "");

      // Template block usage:" + EOL +
      await render(hbs`
      {{#modal-dialog}}
        template block text
      {{/modal-dialog}}
    `);

      assert.equal(find('*').textContent.trim(), "template block text");
  });
});
