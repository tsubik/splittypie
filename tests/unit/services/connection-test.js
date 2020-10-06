import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Unit | Service | connection", function(hooks) {
  setupTest(hooks);

  function changeConnectionStateTo(state) {
      const event = new window.Event(state);
      window.dispatchEvent(event);
  }

  test("it has current navigator status", function (assert) {
      assert.expect(1);

      const isOnline = window.navigator.onLine;
      const service = this.owner.lookup("service:connection");

      assert.equal(service.get("isOnline"), isOnline);
  });

  test("it changes state to online if connection state online", function (assert) {
      const service = this.owner.lookup("service:connection");
      changeConnectionStateTo("offline");

      assert.equal(service.get("state"), "offline");

      changeConnectionStateTo("online");

      assert.equal(service.get("state"), "online");
  });
});
