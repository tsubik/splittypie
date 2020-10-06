import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, find } from '@ember/test-helpers';
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

module("Integration | Component | calendar page", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
      const date = "2015-03-01";

      this.set("date", date);
      await render(hbs`{{calendar-page date=date}}`);

      assert.equal(extraTrim(find('*').textContent), "Mar 01");
  });
});
