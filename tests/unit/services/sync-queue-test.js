import EmberObject from "@ember/object";
import { run } from "@ember/runloop";
import { equal } from "@ember/object/computed";
import { resolve } from "rsvp";
import { moduleFor, test } from "ember-qunit";
import sinonTest from "ember-sinon-qunit/test-support/test";

const ConnectionMock = EmberObject.extend({
    state: "online",
    isOnline: equal("state", "online"),
    isOffline: equal("state", "offline"),
});
const JobProcessorMock = EmberObject.extend({
    process() {
        return resolve(true);
    },
});
const SyncJobModelMock = EmberObject.extend({
    save() {
        return resolve(this);
    },

    destroyRecord() {
        return resolve(true);
    },
});
const StoreMock = EmberObject.extend({
    createRecord(modelName, properties) {
        return SyncJobModelMock.create(properties);
    },
});

moduleFor("service:sync-queue", "Unit | Service | sync queue", {
    beforeEach() {
        this.register('service:job-processor', JobProcessorMock);
        this.register('service:connection', ConnectionMock);
        this.register('service:store', StoreMock);
    },
});

test("it initializes correctly", function (assert) {
    assert.expect(2);

    const service = this.subject();

    assert.ok(service);
    assert.equal(service.get("pendingJobs").length, 0, "empty table of pending jobs");
});

sinonTest("enqueue creates new job and saves to offline store", function (assert) {
    assert.expect(1);

    const service = this.subject();
    const model = SyncJobModelMock.create();
    const modelSaveSpy = this.spy(model, "save");

    this.stub(service.get('store'), "createRecord").returns(model);

    run(() => {
        service.enqueue("jobname", {}).then(() => {
            assert.ok(modelSaveSpy.calledOnce);
        });
    });
});

sinonTest("enqueue add to pendingJobs if connection online", function (assert) {
    assert.expect(2);

    const service = this.subject();
    const pendingJobsDidChangeSpy = this.spy(service, "pendingJobsDidChange");
    const processNextSpy = this.spy(service, "_processNext");

    run(() => {
        service.enqueue("testjob", {}).then(() => {
            assert.ok(pendingJobsDidChangeSpy.calledTwice);
            assert.ok(processNextSpy.calledOnce);
        });
    });
});

sinonTest("enqueue doesn't add to pendingJobs if connection offline", function (assert) {
    assert.expect(2);

    const service = this.subject();
    service.get("connection").set("state", "offline");
    const pendingJobsDidChangeSpy = this.spy(service, "pendingJobsDidChange");
    const processNextSpy = this.spy(service, "_processNext");

    run(() => {
        service.enqueue("testjob", {}).then(() => {
            assert.equal(pendingJobsDidChangeSpy.callCount, 0);
            assert.equal(processNextSpy.callCount, 0);
        });
    });
});

sinonTest("new pendingJob execute processNext if not already processing", function (assert) {
    assert.expect(3);

    const service = this.subject();
    const job = SyncJobModelMock.create();
    const processNextSpy = this.spy(service, "_processNext");
    const jobProcessorSpy = this.spy(service.get('jobProcessor'), "process");

    run(() => {
        service.get("pendingJobs").addObject(job);

        assert.ok(processNextSpy.calledOnce);
        assert.ok(service.get("isProcessing", true));
        assert.ok(jobProcessorSpy.calledWith(job));
    });
});

sinonTest("new pendingJob doesn't processNext if already processing", function (assert) {
    assert.expect(1);

    const service = this.subject();
    const job = SyncJobModelMock.create();
    const processNextSpy = this.spy(service, "_processNext");
    service.set("isProcessing", true);

    run(() => {
        service.get("pendingJobs").addObject(job);

        assert.equal(processNextSpy.callCount, 0);
    });
});

sinonTest("flush process all saved jobs", function (assert) {
    assert.expect(1);

    this.register('service:store', EmberObject.extend({
        findAll() {
            return resolve([
                SyncJobModelMock.create(),
                SyncJobModelMock.create(),
                SyncJobModelMock.create(),
            ]);
        },
    }));
    const service = this.subject();
    const jobProcessorSpy = this.spy(service.get('jobProcessor'), "process");

    run(() => {
        service.flush()
            .then(() => {
                assert.equal(jobProcessorSpy.callCount, 3);
            });
    });
});
