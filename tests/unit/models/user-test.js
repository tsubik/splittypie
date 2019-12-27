import { run } from "@ember/runloop";
import { moduleForModel, test } from "ember-qunit";

moduleForModel("user", "Unit | Model | user", {
    // Specify the other units that are required for this test.
    needs: ["model:event", "model:transaction", "model:currency"],
});

test("it exists", function (assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

test("it shows user's transactions balance", function (assert) {
    const store = this.store();
    let alice;
    let bob;

    run(() => {
        const event = store.createRecord("event", {
            name: "Test event",
        });
        alice = this.subject();
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
