import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | switch event dropdown", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const events = [
          EmberObject.create({ id: 1, name: "Test event 1" }),
          EmberObject.create({ id: 2, name: "Second event" }),
      ];

      this.set("events", events);
      this.set("selected", events[0]);

      await render(hbs`{{switch-event-dropdown selected=selected events=events}}`);

      assert.equal(extraTrim(find('*').textContent), "Test event 1 Switch to Second event Add New Event");
  });
});
