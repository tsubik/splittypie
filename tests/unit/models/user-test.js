import { moduleForModel, test } from "ember-qunit";
import Ember from "ember";

moduleForModel("user", "Unit | Model | user", {
    // Specify the other units that are required for this test.
    needs: ["model:event", "model:transaction"]
});

test("it exists", function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

test("it shows user's transactions balance", function(assert) {
    let store = this.store();
    let alice, bob;

    Ember.run(() => {
        let event = store.createRecord("event", {
            name: "Test event"
        });
        alice = this.subject();
        bob = store.createRecord("user", {
            name: "Bob",
            event: event
        });
        let transaction = store.createRecord("transaction", {
            name: "Alice bought a present",
            amount: 120,
            payer: alice,
            participants: [alice, bob]
        });

        alice.set("event", event);
        event.get("transactions").pushObject(transaction);
    });

    assert.equal(alice.get("balance"), 60);
    assert.equal(bob.get("balance"), -60);
});
