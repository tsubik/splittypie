import { visit } from '@ember/test-helpers';
/* eslint "arrow-body-style": 0 */
import { Promise } from "rsvp";
import { module, test } from "qunit";

import setupApplicationTest from "splittypie/tests/helpers/setup-application-test";
import runAndWaitForSyncQueueToFlush from "splittypie/tests/helpers/run-and-wait-for-sync-queue-to-flush";
import runWithTestData from "splittypie/tests/helpers/run-with-test-data";

function createEvent(store) {
    return store.createRecord("event", {
        name: "Test event",
        currency: store.findRecord("currency", "EUR"),
        transactions: [],
        users: [
            store.createRecord("user", { name: "Tomasz" }),
            store.createRecord("user", { name: "Maciej" }),
        ],
    });
}

function syncOnline() {
    this.connection.set("state", "online");

    return new Promise((resolve) => {
        this.syncer.one("syncCompleted", resolve);
    });
}

module("Acceptance | synchronization", function (hooks) {
    setupApplicationTest(hooks);
    hooks.beforeEach(async function () {
        this.eventRepository = this.owner.lookup("service:event-repository");
        this.transactionRepository = this.owner.lookup("service:transaction-repository");
        this.offlineStore = this.owner.lookup("service:store");
        this.onlineStore = this.owner.lookup("service:online-store");
        this.connection = this.owner.lookup("service:connection");
        this.syncQueue = this.owner.lookup("service:sync-queue");
        this.syncer = this.owner.lookup("service:syncer");

        await visit("/");
    });

    test("creates event in both stores when online", async function (assert) {
        assert.expect(2);

        const event = createEvent(this.offlineStore);
        await this.eventRepository.save(event);
        assert.ok(
            !!this.offlineStore.peekRecord("event", event.get("id")), "event in offline store"
        );
        assert.ok(!!this.onlineStore.peekRecord("event", event.get("id")), "event in online store");
    });

    test("creates event in offline store first and then moves to online", async function (assert) {
        assert.expect(3);

        this.connection.set("state", "offline");

        const event = createEvent(this.offlineStore);
        await this.eventRepository.save(event);

        assert.ok(
            !!this.offlineStore.peekRecord("event", event.get("id")), "event in offline store"
        );
        assert.notOk(
            !!this.onlineStore.peekRecord("event", event.get("id")), "event not in online store"
        );
        await runAndWaitForSyncQueueToFlush(() => this.connection.set("state", "online"));
        assert.ok(!!this.onlineStore.peekRecord("event", event.get("id")), "event in online store");
    });

    test("store event in offline store if not present and fetching from online", function (assert) {
        assert.expect(2);

        runWithTestData("default", async (events) => {
            const event = events[0];

            let found = await this.offlineStore.findRecord("event", event.id).then(() => true).catch(() => false);
            assert.notOk(found, "no event found in offline store");

            await this.eventRepository.find(event.id);
            found = await this.offlineStore.findRecord("event", event.id).then(() => true).catch(() => false);

            assert.ok(found, "event found in offline store");
        });
    });

    test("deletes event from both stores when online", function (assert) {
        assert.expect(4);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;
            const event = await this.eventRepository.find(eventId);
            assert.ok(Boolean(this.onlineStore.peekRecord("event", eventId)), "exists online");
            assert.ok(Boolean(this.offlineStore.peekRecord("event", eventId)), "exists offline");

            await runAndWaitForSyncQueueToFlush(() => this.eventRepository.remove(event));
            assert.ok(
                Boolean(this.offlineStore.peekRecord("event", eventId)).isDeleted,
                "doesn't exist offline"
            );
            assert.ok(
                Boolean(this.onlineStore.peekRecord("event", eventId).isDeleted, "doesn't exist online")
            );
        });
    });

    test("removes event from offline store first and from online when online", function (assert) {
        assert.expect(6);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;

            const event = await this.eventRepository.find(eventId);

            await simulateDelay(500);

            assert.ok(!!this.onlineStore.peekRecord("event", eventId), "exists online");
            assert.ok(!!this.offlineStore.peekRecord("event", eventId), "exists offline");

            this.connection.set("state", "offline");
            await this.eventRepository.remove(event);
            assert.ok(!!this.onlineStore.peekRecord("event", eventId), "exists online");
            assert.ok(
                this.offlineStore.peekRecord("event", eventId).isDeleted,
                "removed offline"
            );

            await runAndWaitForSyncQueueToFlush(() => this.connection.set("state", "online"));
            assert.ok(
                this.onlineStore.peekRecord("event", eventId).isDeleted,
                "doesn't exist online"
            );
            assert.ok(
                this.offlineStore.peekRecord("event", eventId).isDeleted,
                "removed offline"
            );
        });
    });

    test("synchronize event local changes to online store", function (assert) {
        assert.expect(4);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;

            const event = await this.eventRepository.find(eventId);
            this.connection.set("state", "offline");
            event.set("name", "Changed name");

            await this.eventRepository.save(event);

            await simulateDelay(500);

            let offEvent = this.offlineStore.peekRecord("event", eventId);
            let onEvent = this.onlineStore.peekRecord("event", eventId);

            assert.equal(offEvent.get("name"), "Changed name", "offline event changed");
            assert.equal(
                onEvent.get("name"), "Trip to Barcelona", "online event not changed"
            );
            await runAndWaitForSyncQueueToFlush(() => this.connection.set("state", "online"));
            offEvent = this.offlineStore.peekRecord("event", eventId);
            onEvent = this.onlineStore.peekRecord("event", eventId);

            assert.equal(offEvent.get("name"), "Changed name", "offline event changed");
            assert.equal(onEvent.get("name"), "Changed name", "online event changed");
        });
    });

    test("synchronize event online changes to offline store", function (assert) {
        assert.expect(1);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;
            const eventRef = this.owner.lookup("service:firebaseApp").database().ref(`events/${eventId}`);

            await this.eventRepository.find(eventId);
            this.connection.set("state", "offline");

            await eventRef.child("name").set("Name changed online");
            await syncOnline();

            const offEvent = this.offlineStore.peekRecord("event", eventId);

            assert.equal(
                offEvent.get("name"), "Name changed online", "offline event changed"
            );
        });
    });

    // Transactions

    test("creates transaction in offline store first and then moves to online", async function (assert) {
        assert.expect(4);
        let transaction;

        const event = await createEvent(this.offlineStore);

        this.connection.set("state", "offline");

        await this.eventRepository.save(event)

        transaction = this.offlineStore.createRecord("transaction", {
            name: "Offline transaction",
            amount: 100,
            payer: event.get("users").findBy("name", "Maciej"),
            participants: event.get("users"),
        });

        await this.transactionRepository.save(event, transaction);
        await simulateDelay(500);

        assert.ok(
            !!this.offlineStore.peekRecord("transaction", transaction.get("id")),
            "exists in offline store"
        );
        assert.notOk(
            !!this.onlineStore.peekRecord("transaction", transaction.get("id")),
            "doesn't exist in online store"
        );

        await syncOnline();

        assert.ok(
            !!this.offlineStore.peekRecord("transaction", transaction.get("id")),
            "exists in offline store"
        );
        assert.ok(
            !!this.onlineStore.peekRecord("transaction", transaction.get("id")),
            "exist in online store"
        );
    });

    test("removes transaction from offline store first and online when online", function (assert) {
        assert.expect(4);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;
            let transactionToRemoveId;

            const event = await this.eventRepository.find(eventId)
            this.connection.set("state", "offline");

            const transaction = event.get("transactions.firstObject");
            transactionToRemoveId = transaction.get("id");

            await this.transactionRepository.remove(transaction);
            await simulateDelay(500);

            assert.ok(
                this.offlineStore.peekRecord("transaction", transactionToRemoveId).isDeleted,
                "doesn't exist offline"
            );
            assert.ok(
                !!this.onlineStore.peekRecord("transaction", transactionToRemoveId),
                "exists online"
            );

            await syncOnline();

            assert.ok(
                this.offlineStore.peekRecord("transaction", transactionToRemoveId).isDeleted,
                "doesn't exist offline"
            );
            assert.ok(
                this.onlineStore.peekRecord("transaction", transactionToRemoveId).isDeleted,
                "removed from online"
            );
        });
    });

    test("synchronize transaction local changes to online store", function (assert) {
        assert.expect(4);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;
            const event = await this.eventRepository.find(eventId)

            this.connection.set("state", "offline");

            const transaction = event.get("transactions.firstObject");
            const oldName = transaction.get("name");
            transaction.set("name", "Name changed offline");

            await this.transactionRepository.save(event, transaction);

            await simulateDelay(500);

            const id = transaction.get("id");
            let offTran = this.offlineStore.peekRecord("transaction", id);
            let onTran = this.onlineStore.peekRecord("transaction", id);

            assert.equal(
                offTran.get("name"), "Name changed offline", "offline name changed"
            );
            assert.equal(onTran.get("name"), oldName, "online name didn't change");

            await syncOnline();

            offTran = this.offlineStore.peekRecord("transaction", id);
            onTran = this.onlineStore.peekRecord("transaction", id);

            assert.equal(
                offTran.get("name"), "Name changed offline", "offline name changed"
            );
            assert.equal(
                onTran.get("name"), "Name changed offline", "online name changed"
            );
        });
    });

    test("synchronize transaction online changes to offline store", function (assert) {
        assert.expect(2);

        runWithTestData("default", async (events) => {
            const eventId = events[0].id;

            this.connection.set("state", "offline");

            const event = this.eventRepository.find(eventId);

            const transactionId = event.get("transactions.firstObject.id");
            const transactionRef = this.owner
                                       .lookup("service:firebaseApp")
                                       .database()
                                       .ref(`events/${eventId}/transactions/${transactionId}`);

            transactionRef.child("name").set("Name changed online");

            await syncOnline();

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
