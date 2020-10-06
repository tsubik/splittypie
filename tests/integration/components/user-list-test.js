import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, findAll, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | user list", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      await render(hbs`{{user-list}}`);

      assert.equal(find('*').textContent.trim(), "");
  });

  test("it renders user forms", async function(assert) {
      const users = [
          { name: "Bob" },
          { name: "Yuri" },
      ];

      this.set("users", users);
      await render(hbs`{{user-list users=users}}`);

      assert.equal(findAll(".user-form").length, 2);
  });
});
