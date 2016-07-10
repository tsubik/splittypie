import { moduleFor, test } from "ember-qunit";
import Ember from "ember";
import sinonTest from "splittypie/tests/ember-sinon-qunit/test";

const {
    run,
    computed: { equal },
    RSVP: { resolve },
} = Ember;

const ConnectionMock = Ember.Object.extend({
    state: "online",
    isOnline: equal("state", "online"),
    isOffline: equal("state", "offline"),
});
const JobProcessorMock = Ember.Object.extend({
    process() {
        return resolve(true);
    },
});
const SyncJobModelMock = Ember.Object.extend({
    save() {
        return resolve(this);
    },

    destroyRecord() {
        return resolve(true);
    },
});
const StoreMock = Ember.Object.extend({
    createRecord(modelName, properties) {
        return SyncJobModelMock.create(properties);
    },
});

moduleFor("service:sync-queue", "Unit | Service | sync queue", {
    beforeEach() {
        this.subject({
            connection: ConnectionMock.create(),
            jobProcessor: JobProcessorMock.create(),
            store: StoreMock.create(),
        });
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

    this.stub(service.store, "createRecord").returns(model);

    run(() => {
        service.enqueue("jobname", {});

        assert.ok(modelSaveSpy.calledOnce);
    });
});

sinonTest("enqueue add to pendingJobs if connection online", function (assert) {
    assert.expect(2);

    const service = this.subject();
    const pendingJobsDidChangeSpy = this.spy(service, "pendingJobsDidChange");

    run(() => {
        service.enqueue("testjob", {});

        assert.equal(service.get("pendingJobs.length"), 1);
        assert.ok(pendingJobsDidChangeSpy.calledOnce);
    });
});

sinonTest("enqueue doesn't add to pendingJobs if connection offline", function (assert) {
    assert.expect(2);

    const service = this.subject();
    service.get("connection").set("state", "offline");
    const pendingJobsDidChangeSpy = this.spy(service, "pendingJobsDidChange");

    run(() => {
        service.enqueue("testjob", {});

        assert.equal(service.get("pendingJobs.length"), 0);
        assert.equal(pendingJobsDidChangeSpy.callCount, 0);
    });
});

sinonTest("new pendingJob execute processNext if not already processing", function (assert) {
    assert.expect(3);

    const service = this.subject();
    const job = SyncJobModelMock.create();
    const processNextSpy = this.spy(service, "_processNext");
    const jobProcessorSpy = this.spy(service.jobProcessor, "process");

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

    const service = this.subject();
    service.store = Ember.Object.create({
        findAll() {
            return resolve([
                SyncJobModelMock.create(),
                SyncJobModelMock.create(),
                SyncJobModelMock.create(),
            ]);
        },
    });
    const jobProcessorSpy = this.spy(service.jobProcessor, "process");

    run(() => {
        service.flush()
            .then(() => {
                assert.equal(jobProcessorSpy.callCount, 3);
            });
    });
});
