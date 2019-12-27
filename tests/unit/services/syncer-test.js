import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import { equal } from '@ember/object/computed';
import { resolve } from 'rsvp';
import { moduleFor } from "ember-qunit";
import sinonTest from "ember-sinon-qunit/test-support/test";
import sinon from "sinon";

const ConnectionMock = EmberObject.extend({
    state: "offline",
    isOnline: equal("state", "online"),
    isOffline: equal("state", "offline"),
});
const StoreMock = EmberObject.extend({
    unloadAll() {},

    findAll() {
        return resolve([]);
    },
});
const SyncQueueMock = EmberObject.extend({
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
