import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find, findAll } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | event form", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      assert.expect(4);

      // Template block usage:" + EOL +
      await render(hbs`{{event-form}}`);

      assert.equal(find(".event-name").getAttribute("placeholder"), "Example: Trip to Barcelona");
      assert.equal(find(".event-name").value, "");
      assert.equal(this.$(".event-currency").find(":selected").val(), "");
      assert.equal(findAll(".user-name").length, 0);
  });

  test("it renders with model properties", async function(assert) {
      assert.expect(6);
      const currencies = [
          { id: "USD", code: "USD", name: "Dolar" },
          { id: "CAD", code: "CAD", name: "Dolar kanadyjski" },
          { id: "EUR", code: "EUR", name: "Euro" },
      ];
      const event = EmberObject.create({
          name: "Test event",
          currency: currencies[0],
          users: [
              { name: "Bob" },
              { name: "Alice" },
              { name: "John" },
          ],
      });

      this.set("event", event);
      this.set("currencies", currencies);
      await render(hbs`{{event-form currencies=currencies event=event}}`);

      assert.equal(find(".event-name").value, "Test event");
      assert.equal(this.$(".event-currency").find(":selected").val(), "USD");
      assert.equal(findAll(".user-name").length, 3);
      assert.equal(this.$(".user-name").eq(0).val(), "Bob");
      assert.equal(this.$(".user-name").eq(1).val(), "Alice");
      assert.equal(this.$(".user-name").eq(2).val(), "John");
  });
});
