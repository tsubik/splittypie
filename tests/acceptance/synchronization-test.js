/* eslint "arrow-body-style": 0 */

import { later } from "@ember/runloop";

import { Promise } from "rsvp";
import { test } from "qunit";
import moduleForAcceptance from "splittypie/tests/helpers/module-for-acceptance";

moduleForAcceptance("Acceptance | synchronization", {
    beforeEach() {
        this.eventRepository = this.application.__container__.lookup("service:event-repository");
        this.transactionRepository = this.application.__container__
            .lookup("service:transaction-repository");
        this.offlineStore = this.application.__container__.lookup("service:store");
        this.onlineStore = this.application.__container__.lookup("service:online-store");
        this.connection = this.application.__container__.lookup("service:connection");
        this.syncQueue = this.application.__container__.lookup("service:sync-queue");
        this.syncer = this.application.__container__.lookup("service:syncer");

        visit("/");
    },
});
function createEvent(store) {
    return store.createRecord("event", {
        name: "Test event",
        currency: store.findRecord("currency", "EUR"),
        participants: [
            store.createRecord("user", { name: "Tomasz" }),
            store.createRecord("user", { name: "Maciej" }),
        ],
    });
}

function simulateDelay(miliseconds) {
    return new Promise((resolve) => {
        later(resolve, miliseconds);
    });
}

function syncOnline() {
    this.connection.set("state", "online");

    return new Promise((resolve) => {
        this.syncer.one("syncCompleted", resolve);
    });
}

test("creates event in both stores when online", function (assert) {
    assert.expect(2);
    let event;

    andThen(() => {
        event = createEvent(this.offlineStore);

        return this.eventRepository.save(event);
    });
    andThen(() => {
        assert.ok(
            !!this.offlineStore.peekRecord("event", event.get("id")), "event in offline store"
        );
        assert.ok(!!this.onlineStore.peekRecord("event", event.get("id")), "event in online store");
    });
});

test("creates event in offline store first and then moves to online", function (assert) {
    assert.expect(3);
    let event;

    this.connection.set("state", "offline");

    andThen(() => {
        event = createEvent(this.offlineStore);

        return this.eventRepository.save(event);
    });
    andThen(() => {
        assert.ok(
            !!this.offlineStore.peekRecord("event", event.get("id")), "event in offline store"
        );
        assert.notOk(
            !!this.onlineStore.peekRecord("event", event.get("id")), "event not in online store"
        );
    });
    runAndWaitForSyncQueueToFlush(() => this.connection.set("state", "online"));
    andThen(() => {
        assert.ok(!!this.onlineStore.peekRecord("event", event.get("id")), "event in online store");
    });
});

test("store event in offline store if not present and fetching from online", function (assert) {
    assert.expect(2);

    runWithTestData("default", (events) => {
        const event = events[0];

        andThen(() => {
            return this.offlineStore.findRecord("event", event.id)
                .then(() => true)
                .catch(() => false)
                .then((found) => {
                    assert.notOk(found, "no event found in offline store");
                });
        });
        andThen(() => this.eventRepository.find(event.id));
        andThen(() => {
            return this.offlineStore.findRecord("event", event.id)
                .then(() => true)
                .catch(() => false)
                .then(found => assert.ok(found, "event found in offline store"));
        });
    });
});

test("deletes event from both stores when online", function (assert) {
    assert.expect(4);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        let event;

        andThen(() => {
            return this.eventRepository
                .find(eventId)
                .then((e) => {
                    event = e;
                });
        });
        andThen(() => {
            assert.ok(!!this.onlineStore.peekRecord("event", eventId), "exists online");
            assert.ok(!!this.offlineStore.peekRecord("event", eventId), "exists offline");
        });
        runAndWaitForSyncQueueToFlush(() => this.eventRepository.remove(event));
        andThen(() => {
            assert.notOk(
                !!this.onlineStore.peekRecord("event", eventId), "doesn't exist online"
            );
            assert.notOk(
                !!this.offlineStore.peekRecord("event", eventId),
                "doesn't exist offline"
            );
        });
    });
});

test("removes event from offline store first and from online when online", function (assert) {
    assert.expect(6);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        let event;

        andThen(() => {
            return this.eventRepository
                .find(eventId)
                .then((e) => { event = e; });
        });
        andThen(simulateDelay.bind(this, 500));
        andThen(() => {
            assert.ok(!!this.onlineStore.peekRecord("event", eventId), "exists online");
            assert.ok(!!this.offlineStore.peekRecord("event", eventId), "exists offline");

            this.connection.set("state", "offline");
        });
        andThen(() => this.eventRepository.remove(event));
        andThen(() => {
            assert.ok(!!this.onlineStore.peekRecord("event", eventId), "exists online");
            assert.notOk(
                !!this.offlineStore.peekRecord("event", eventId),
                "doesn't exist offline"
            );
        });
        runAndWaitForSyncQueueToFlush(() => this.connection.set("state", "online"));
        andThen(() => {
            assert.notOk(
                !!this.onlineStore.peekRecord("event", eventId),
                "doesn't exist online"
            );
            assert.notOk(
                !!this.offlineStore.peekRecord("event", eventId),
                "doesn't exist offline"
            );
        });
    });
});

test("synchronize event local changes to online store", function (assert) {
    assert.expect(4);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        let event;

        andThen(() => {
            return this.eventRepository
                .find(eventId)
                .then((e) => { event = e; });
        });
        andThen(() => {
            this.connection.set("state", "offline");
            event.set("name", "Changed name");
            return this.eventRepository.save(event);
        });
        andThen(simulateDelay.bind(this, 500));
        andThen(() => {
            const offEvent = this.offlineStore.peekRecord("event", eventId);
            const onEvent = this.onlineStore.peekRecord("event", eventId);

            assert.equal(offEvent.get("name"), "Changed name", "offline event changed");
            assert.equal(
                onEvent.get("name"), "Trip to Barcelona", "online event not changed"
            );
        });
        runAndWaitForSyncQueueToFlush(() => this.connection.set("state", "online"));
        andThen(() => {
            const offEvent = this.offlineStore.peekRecord("event", eventId);
            const onEvent = this.onlineStore.peekRecord("event", eventId);

            assert.equal(offEvent.get("name"), "Changed name", "offline event changed");
            assert.equal(onEvent.get("name"), "Changed name", "online event changed");
        });
    });
});

test("synchronize event online changes to offline store", function (assert) {
    assert.expect(1);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        const eventRef = this.application.__container__.lookup("service:firebaseApp")
                  .database().ref(`events/${eventId}`);

        andThen(() => this.eventRepository.find(eventId));
        andThen(() => {
            this.connection.set("state", "offline");

            return new Promise((resolve) => {
                eventRef.child("name").set("Name changed online").then(resolve);
            });
        });
        andThen(syncOnline.bind(this));
        andThen(() => {
            const offEvent = this.offlineStore.peekRecord("event", eventId);

            assert.equal(
                offEvent.get("name"), "Name changed online", "offline event changed"
            );
        });
    });
});

// Transactions

test("creates transaction in offline store first and then moves to online", function (assert) {
    assert.expect(4);
    let transaction;

    andThen(() => {
        const event = createEvent(this.offlineStore);

        this.connection.set("state", "offline");
        return this.eventRepository
            .save(event)
            .then(() => {
                transaction = this.offlineStore.createRecord("transaction", {
                    name: "Offline transaction",
                    amount: 100,
                    payer: event.get("users").findBy("name", "Maciej"),
                    participants: event.get("users"),
                });

                return this.transactionRepository.save(event, transaction);
            });
    });
    andThen(simulateDelay.bind(this, 500));
    andThen(() => {
        assert.ok(
            !!this.offlineStore.peekRecord("transaction", transaction.get("id")),
            "exists in offline store"
        );
        assert.notOk(
            !!this.onlineStore.peekRecord("transaction", transaction.get("id")),
            "doesn't exist in online store"
        );
    });
    andThen(syncOnline.bind(this));
    andThen(() => {
        assert.ok(
            !!this.offlineStore.peekRecord("transaction", transaction.get("id")),
            "exists in offline store"
        );
        assert.ok(
            !!this.onlineStore.peekRecord("transaction", transaction.get("id")),
            "exist in online store"
        );
    });
});

test("removes transaction from offline store first and online when online", function (assert) {
    assert.expect(4);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        let transactionToRemoveId;

        andThen(() => {
            return this.eventRepository
                .find(eventId)
                .then((event) => {
                    this.connection.set("state", "offline");

                    const transaction = event.get("transactions.firstObject");
                    transactionToRemoveId = transaction.get("id");

                    return this.transactionRepository.remove(transaction);
                });
        });
        andThen(simulateDelay.bind(this, 500));
        andThen(() => {
            assert.notOk(
                !!this.offlineStore.peekRecord("transaction", transactionToRemoveId),
                "doesn't exist offline"
            );
            assert.ok(
                !!this.onlineStore.peekRecord("transaction", transactionToRemoveId),
                "exists online"
            );
        });
        andThen(syncOnline.bind(this));
        andThen(() => {
            assert.notOk(
                !!this.offlineStore.peekRecord("transaction", transactionToRemoveId),
                "doesn't exist offline"
            );
            assert.notOk(
                !!this.onlineStore.peekRecord("transaction", transactionToRemoveId),
                "doesn't exist online"
            );
        });
    });
});

test("synchronize transaction local changes to online store", function (assert) {
    assert.expect(4);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        let transaction;
        let oldName;

        andThen(() => {
            return this.eventRepository
                .find(eventId)
                .then((event) => {
                    this.connection.set("state", "offline");

                    transaction = event.get("transactions.firstObject");
                    oldName = transaction.get("name");
                    transaction.set("name", "Name changed offline");

                    return this.transactionRepository.save(event, transaction);
                });
        });
        andThen(simulateDelay.bind(this, 500));
        andThen(() => {
            const id = transaction.get("id");
            const offTran = this.offlineStore.peekRecord("transaction", id);
            const onTran = this.onlineStore.peekRecord("transaction", id);

            assert.equal(
                offTran.get("name"), "Name changed offline", "offline name changed"
            );
            assert.equal(onTran.get("name"), oldName, "online name didn't change");
        });
        andThen(syncOnline.bind(this));
        andThen(() => {
            const id = transaction.get("id");
            const offTran = this.offlineStore.peekRecord("transaction", id);
            const onTran = this.onlineStore.peekRecord("transaction", id);

            assert.equal(
                offTran.get("name"), "Name changed offline", "offline name changed"
            );
            assert.equal(
                onTran.get("name"), "Name changed offline", "online name changed"
            );
        });
    });
});

test("synchronize transaction online changes to offline store", function (assert) {
    assert.expect(2);

    runWithTestData("default", (events) => {
        const eventId = events[0].id;
        let transactionId;

        andThen(() => {
            this.connection.set("state", "offline");

            return this.eventRepository
                .find(eventId)
                .then((event) => {
                    transactionId = event.get("transactions.firstObject.id");
                    const transactionRef = this.application
                              .__container__
                              .lookup("service:firebaseApp")
                              .database()
                              .ref(`events/${eventId}/transactions/${transactionId}`);

                    return transactionRef.child("name").set("Name changed online");
                });
        });
        andThen(syncOnline.bind(this));
        andThen(() => {
            const offTran = this.offlineStore.peekRecord("transaction", transactionId);
            const onTran = this.onlineStore.peekRecord("transaction", transactionId);

            assert.equal(
                offTran.get("name"), "Name changed online", "offline name changed"
            );
            assert.equal(
                onTran.get("name"), "Name changed online", "online name changed"
            );
        });
    });
});
