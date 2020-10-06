import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | user balance list", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const event = EmberObject.create({
          currency: EmberObject.create({
              code: "PLN",
          }),
      });

      const users = [
          EmberObject.create({ name: "Bob", balance: 100, event }),
          EmberObject.create({ name: "Alice", balance: -100, event }),
      ];

      this.set("users", users);
      await render(hbs`{{user-balance-list users=users}}`);

      assert.equal(extraTrim(this.$(".user-balance-list-item").eq(0).text()), "Bob 100.00 PLN");
      assert.equal(extraTrim(this.$(".user-balance-list-item").eq(1).text()), "Alice -100.00 PLN");
  });
});
