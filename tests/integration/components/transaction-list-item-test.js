import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | transaction list item", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      assert.expect(1);

      const users = [
          { id: 1, name: "Bob" },
          { id: 2, name: "John" },
          { id: 3, name: "Billy" },
      ];

      const transaction = EmberObject.create({
          payer: users[1],
          name: "Gift for Alice",
          amount: "200",
          participants: users.slice(1),
          event: {
              currency: { code: "USD" },
          },
      });

      this.set("transaction", transaction);
      await render(hbs`{{transaction-list-item transaction=transaction}}`);

      assert.equal(
          extraTrim(find('*').textContent),
          "John paid for Gift for Alice John, Billy 200.00 USD"
      );
  });
});
