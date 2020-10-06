import { run } from "@ember/runloop";
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Unit | Model | user", function(hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
      const model = run(() => this.owner.lookup('service:store').createRecord('user'));
      // let store = this.store();
      assert.ok(!!model);
  });

  test("it shows user's transactions balance", function (assert) {
      const store = this.owner.lookup('service:store');
      let alice;
      let bob;

      run(() => {
          const event = store.createRecord("event", {
              name: "Test event",
          });
          alice = run(() => this.owner.lookup('service:store').createRecord('user'));
          bob = store.createRecord("user", {
              name: "Bob",
              event,
          });
          const transaction = store.createRecord("transaction", {
              name: "Alice bought a present",
              amount: 120,
              payer: alice,
              participants: [alice, bob],
          });

          alice.set("event", event);
          event.get("transactions").pushObject(transaction);
      });

      assert.equal(alice.get("balance"), 60);
      assert.equal(bob.get("balance"), -60);
  });
});
