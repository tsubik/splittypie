import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | switch user dropdown", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const users = [
          EmberObject.create({ id: 1, name: "Tomasz" }),
          EmberObject.create({ id: 2, name: "Bob" }),
      ];

      this.set("users", users);
      this.set("selected", users[0]);
      this.set("onChange", () => {});

      await render(hbs`{{switch-user-dropdown selected=selected users=users onChange=(action onChange)}}`);

      assert.equal(extraTrim(find('*').textContent), "Viewing as Tomasz Switch user to Bob");
  });
});
