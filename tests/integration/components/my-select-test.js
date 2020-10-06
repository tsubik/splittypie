import { module, test } from 'qunit';
/* eslint-disable newline-per-chained-call */

import { setupRenderingTest } from "ember-qunit";
import { render, findAll } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | my select", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const items = [
          { value: 1, label: "Label for value 1" },
          { value: 2, label: "Label for value 2" },
      ];

      this.set("items", items);

      await render(hbs`{{my-select options=items optionValuePath="value" optionLabelPath="label"}}`);

      assert.equal(findAll("option").length, 2);
      assert.equal(this.$("option").eq(0).text().trim(), "Label for value 1");
      assert.equal(this.$("option").eq(1).text().trim(), "Label for value 2");
  });

  test("it selects selected element", async function(assert) {
      const items = [
          { value: 1, label: "Label for value 1" },
          { value: 2, label: "Label for value 2" },
      ];

      this.set("items", items);
      this.set("selected", items[1]);

      await render(hbs`
  {{my-select options=items selected=selected optionValuePath="value" optionLabelPath="label"}}
  `);

      assert.equal(findAll("option").length, 2);
      assert.equal(this.$("option").eq(0).is(":selected"), false);
      assert.equal(this.$("option").eq(1).is(":selected"), true);
  });

  test("it renders prompt if provided", async function(assert) {
      const items = [
          { value: 1, label: "Label for value 1" },
          { value: 2, label: "Label for value 2" },
      ];

      this.set("items", items);
      await render(hbs`
  {{my-select prompt="Select item..." options=items optionValuePath="value" optionLabelPath="label"}}
  `);

      assert.equal(findAll("option").length, 3);
      assert.equal(this.$("option").eq(0).text().trim(), "Select item...");
      assert.equal(this.$("option").eq(1).text().trim(), "Label for value 1");
      assert.equal(this.$("option").eq(2).text().trim(), "Label for value 2");
  });
});
