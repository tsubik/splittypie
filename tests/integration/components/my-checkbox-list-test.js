import { module, test } from 'qunit';
/* eslint-disable newline-per-chained-call */

import { setupRenderingTest } from "ember-qunit";
import { render, findAll } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | my checkbox list", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      // Set any properties with this.set("myProperty", "value");
      // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +
      const items = [
          { value: 1, label: "Label for value 1" },
          { value: 2, label: "Label for value 2" },
      ];

      this.set("items", items);
      await render(hbs`
  {{my-checkbox-list content=items optionValuePath="value" optionLabelPath="label"}}
  `);

      assert.equal(findAll("label").length, 2);
      assert.equal(this.$("label").eq(0).text().trim(), "Label for value 1");
      assert.equal(this.$("label").eq(1).text().trim(), "Label for value 2");
  });

  test("it checks proper elements", async function(assert) {
      const items = [
          { value: 1, label: "Label for value 1" },
          { value: 2, label: "Label for value 2" },
          { value: 3, label: "Label for value 3" },
      ];

      this.set("items", items);
      this.set("selection", items.slice(1, 3));
      await render(hbs`
  {{my-checkbox-list
  content=items
  selection=selection
  optionValuePath="value"
  optionLabelPath="label"}}
  `);

      assert.equal(this.$("label input").eq(0).is(":checked"), false);
      assert.equal(this.$("label input").eq(1).is(":checked"), true);
      assert.equal(this.$("label input").eq(2).is(":checked"), true);
  });
});
