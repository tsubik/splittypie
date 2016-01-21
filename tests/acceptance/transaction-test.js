import { test } from "qunit";
import moduleForAcceptance from "splitr-lite/tests/helpers/module-for-acceptance";
import Ember from "ember";

moduleForAcceptance("Acceptance | transaction");

test("adding new transaction", function (assert) {
    let event;

    waitForPromise(new Ember.RSVP.Promise((resolve) => {
        Ember.run(() => {
            this.store.findRecord("currency", "USD").then((currency) => {
                event = this.store.createRecord("event", {
                    name: "Test event",
                    currency: currency,
                    users: [
                        this.store.createRecord("user", { name: "Alice" }),
                        this.store.createRecord("user", { name: "Bob" })
                    ]
                });
                event.save().then(resolve);
            });
        });
    }));
    andThen(() => {
        visit(`/${event.id}/transactions`);
    });
    andThen(() => {
        assert.ok(!!find("div:contains('There are no transactions yet')").length, "No transactions text");
        click("a:contains('Add Transaction')");
    });
    andThen(() => {
        const AliceId = find(".transaction-payer select option:contains('Alice')").val();
        fillIn(".transaction-payer", AliceId);
        fillIn(".transaction-name", "special bottle of vodka");
        fillIn(".transaction-amount", "50");
        click(".transaction-participants input");
        click("button:contains('Create Transaction')");
    });
    //check for transaction
    andThen(() => {
        assert.ok(!!find(".transaction-list-item:contains('Alice paid 50 USD for special bottle of vodka')").length, "transaction item");
    });
});

test("editing transaction", function (assert) {
    let event;

    waitForPromise(new Ember.RSVP.Promise((resolve) => {
        Ember.run(() => {
            this.store.findRecord("currency", "USD").then((currency) => {
                const alice = this.store.createRecord("user", { name: "Alice" });
                const bob = this.store.createRecord("user", { name: "Bob" });
                const transaction = this.store.createRecord("transaction", {
                    name: "Gift",
                    payer: alice,
                    amount: 200,
                    participants: [alice, bob]
                });
                event = this.store.createRecord("event", {
                    name: "Test event",
                    currency: currency,
                    users: [alice, bob],
                    transactions: [transaction]
                });
                event.save().then(resolve);
            });
        });
    }));

    andThen(() => {
        visit(`/${event.id}/transactions`);
    });
    andThen(() => {
        assert.ok(!!find(".transaction-list-item:contains('Alice paid 200 USD for Gift')").length, "transaction item");
        assert.ok(!!find(".transaction-list-item:contains('Participants: Alice, Bob')"));

        click("a.edit-transaction");
    });
    andThen(() => {
        const BobId = find(".transaction-payer select option:contains('Bob')").val();
        fillIn(".transaction-payer", BobId);
        fillIn(".transaction-name", "special");
        fillIn(".transaction-amount", "50");
        click("button:contains('Save Changes')");
    });
    andThen(() => {
        assert.ok(!!find(".transaction-list-item:contains('Bob paid 50 USD for special')").length, "transaction item");
        assert.ok(!!find(".transaction-list-item:contains('Participants: Alice, Bob')"));
    });
});
