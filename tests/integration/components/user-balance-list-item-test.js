import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | user balance list item", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const user = {
          id: 1,
          name: "Tomasz",
          balance: 123,
          event: {
              currency: { code: "PLN" },
          },
      };

      this.set("user", user);
      await render(hbs`{{user-balance-list-item user=user}}`);

      assert.equal(extraTrim(find('*').textContent), "Tomasz 123.00 PLN", "proper text content");
      assert.ok(find("tr span").classList.contains("label-success"), "success class for positive balance");
  });
});
