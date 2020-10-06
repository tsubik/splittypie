/* eslint-disable newline-per-chained-call */

import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | transaction form", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      assert.expect(4);

      await render(hbs`{{transaction-form}}`);

      assert.equal(this.$(".transaction-payer").find(":selected").val(), "");
      assert.equal(find(".transaction-name").value, "");
      assert.equal(find(".transaction-name").getAttribute("placeholder"), "Example: Tickets to museum");
      assert.equal(find(".transaction-amount").value, "");
  });

  test("it renders with transaction model", async function(assert) {
      assert.expect(4);

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
      });

      this.set("users", users);
      this.set("transaction", transaction);
      await render(hbs`{{transaction-form transaction=transaction users=users}}`);

      assert.equal(this.$(".transaction-payer").find(":selected").text().trim(), "John");
      assert.equal(find(".transaction-name").value, "Gift for Alice");
      assert.equal(find(".transaction-amount").value, "200");
      assert.equal(this.$(".transaction-participants").find(":checked").length, 2);
  });
});
