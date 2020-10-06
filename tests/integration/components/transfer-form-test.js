import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | transfer form", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders with transfer model", async function(assert) {
      assert.expect(3);

      const sender = { id: 1, name: "Bob" };
      const recipient = { id: 2, name: "Alice" };

      const transfer = EmberObject.create({
          sender,
          recipient,
          amount: "200",
          type: "transfer",
      });

      this.set("transfer", transfer);
      await render(hbs`{{transfer-form transfer=transfer}}`);

      assert.equal(find(".transfer-sender").textContent.trim(), "Bob", "sender");
      assert.equal(find(".transfer-recipient").textContent.trim(), "Alice", "recipient");
      assert.equal(find(".transfer-amount").textContent.trim(), "200", "amount");
  });
});
