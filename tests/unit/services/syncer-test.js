import { moduleFor } from "ember-qunit";
import sinonTest from "ember-sinon-qunit/test-support/test";
import Ember from "ember";
import sinon from "sinon";

const {
    run,
    computed: { equal },
    RSVP: { resolve },
} = Ember;

const ConnectionMock = Ember.Object.extend({
    state: "offline",
    isOnline: equal("state", "online"),
    isOffline: equal("state", "offline"),
});
const StoreMock = Ember.Object.extend({
    unloadAll() {},

    findAll() {
        return resolve([]);
    },
});
const SyncQueueMock = Ember.Object.extend({
    flush() {
        return resolve(true);
    },
});

moduleFor("service:syncer", "Unit | Service | syncer", {
    beforeEach() {
        this.subject({
            store: StoreMock.create(),
            onlineStore: StoreMock.create(),
            connection: ConnectionMock.create(),
            syncQueue: SyncQueueMock.create(),
        });
    },
});

sinonTest("start syncing when goes online", function (assert) {
    const service = this.subject();

    service.syncOnline = this.stub();
    service.get("connection").set("state", "online");

    assert.ok(service.syncOnline.calledOnce);
});

sinonTest("syncOnline sets isSyncing property while syncing", function (assert) {
    assert.expect(2);

    const service = this.subject();

    run(() => {
        service.syncOnline().then(() => {
            assert.notOk(service.get("isSyncing"), "after sync state");
        });
        assert.ok(service.get("isSyncing"), "is Syncing state");
    });
});

sinonTest("syncOnline runs operations: reloadOnline, flushQueue, updateOffline", function () {
    const service = this.subject();

    service._reloadOnlineStore = this.stub().returns(resolve(true));
    service._flushSyncQueue = this.stub().returns(resolve(true));
    service._updateOfflineStore = this.stub().returns(resolve(true));

    run(() => {
        service.syncOnline().then(() => {
            sinon.assert.callOrder(
                service._reloadOnlineStore,
                service._flushSyncQueue,
                service._updateOfflineStore
            );
        });
    });
});
