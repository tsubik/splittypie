import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | transaction list header", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const users = [
          { name: "Bob" },
          { name: "Yuri" },
      ];
      const event = {
          name: "Test event",
          currency: {
              code: "USD",
          },
      };
      const transactions = [
          EmberObject.create({
              payer: users[0], event, name: "Transaction 1", amount: "200", participants: users,
          }),
          EmberObject.create({
              payer: users[1], event, name: "Transaction 2", amount: "300", participants: users,
          }),
      ];

      this.set("transactions", transactions);
      this.set("currentUser", users[0]);

      await render(hbs`{{transaction-list-header transactions=transactions currentUser=currentUser}}`);

      assert.equal(extraTrim(find('*').textContent), "Showing 2 expenses Total of 500.00 USD");
  });
});
