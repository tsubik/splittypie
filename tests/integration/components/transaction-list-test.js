import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, findAll, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | transaction list", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders no transactions info", async function(assert) {
      // Set any properties with this.set("myProperty", "value");
      // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

      await render(hbs`{{transaction-list}}`);

      assert.equal(find('*').textContent.trim(), "There are no transactions yet.");
  });

  test("it renders transaction list items", async function(assert) {
      const users = [
          { name: "Bob" },
          { name: "Yuri" },
      ];
      const transactions = [
          EmberObject.create(
              { payer: users[0], date: "", name: "Transaction 1", amount: "200", participants: users }
          ),
          EmberObject.create(
              { payer: users[1], date: "", name: "Transaction 2", amount: "300", participants: users }
          ),
      ];

      this.set("transactions", transactions);
      await render(hbs`{{transaction-list transactions=transactions}}`);

      assert.equal(findAll(".transaction-list-item").length, 2, "renders 2 transactions");
  });
});
