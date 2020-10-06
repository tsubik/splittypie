import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

const TESTENTRY = "testentry";

module("Unit | Service | local storage", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
      window.localStorage.removeItem(TESTENTRY);
  });

  hooks.afterEach(function() {
      window.localStorage.removeItem(TESTENTRY);
  });

  // Replace this with your real tests.
  test("it exists", function (assert) {
      const service = this.owner.lookup("service:local-storage");
      assert.ok(service);
  });
});
