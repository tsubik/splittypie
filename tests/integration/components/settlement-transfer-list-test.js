import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | settlement transfer list", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const users = [
          EmberObject.create({ name: "Bob", balance: 150 }),
          EmberObject.create({ name: "Alice", balance: -100 }),
          EmberObject.create({ name: "George", balance: -50 }),
      ];

      this.set("users", users);
      this.set("settleUpAction", () => {});

      await render(hbs`{{settlement-transfer-list users=users settleUp=(action settleUpAction)}}`);

      assert.ok(!!this.$(":contains('Alice owes Bob')").has(":contains('100')").length);
      assert.ok(!!this.$(":contains('George owes Bob')").has(":contains('50')").length);
  });
});
