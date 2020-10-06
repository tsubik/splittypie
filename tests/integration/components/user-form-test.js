import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | user form", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      await render(hbs`{{user-form}}`);

      assert.equal(find(".user-name").value, "");
  });

  test("it renders with user model", async function(assert) {
      const user = {
          name: "John",
      };

      this.set("user", user);
      await render(hbs`{{user-form user=user}}`);

      assert.equal(find(".user-name").value, "John");
  });
});
