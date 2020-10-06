import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";

module("Integration | Helper | any", function(hooks) {
  setupRenderingTest(hooks);

  test("not empty array", async function(assert) {
      this.set("array", [20, 30]);

      await render(hbs`
  {{#if (any array)}}
  true
  {{/if}}
  `);

      assert.equal(find('*').textContent.trim(), "true");
  });

  test("empty array", async function(assert) {
      this.set("array", []);

      await render(hbs`
  {{#if (any array)}}
  true
  {{/if}}
  `);

      assert.equal(find('*').textContent.trim(), "");
  });

  test("undefined", async function(assert) {
      this.set("array", undefined);

      await render(hbs`
  {{#if (any array)}}
  true
  {{/if}}
  `);

      assert.equal(find('*').textContent.trim(), "");
  });

  test("not array", async function(assert) {
      this.set("array", {});

      await render(hbs`
  {{#if (any array)}}
  true
  {{/if}}
  `);

      assert.equal(find('*').textContent.trim(), "");
  });
});
