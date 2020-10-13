import EmberObject from "@ember/object";
import { run } from "@ember/runloop";
import { equal } from "@ember/object/computed";
import { resolve } from "rsvp";
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

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

module("Unit | Service | sync queue", function(hooks) {
    setupTest(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:job-processor', JobProcessorMock);
        this.owner.register('service:connection', ConnectionMock);
        this.owner.register('service:store', StoreMock);
    });

    test("it initializes correctly", function (assert) {
        assert.expect(2);

        const service = this.owner.lookup("service:sync-queue");

        assert.ok(service);
        assert.equal(service.get("pendingJobs").length, 0, "empty table of pending jobs");
    });

    test("enqueue creates new job and saves to offline store", function (assert) {
        assert.expect(1);

        const service = this.owner.lookup("service:sync-queue");
        const model = SyncJobModelMock.create();
        const modelSaveSpy = this.spy(model, "save");

        this.stub(service.get('store'), "createRecord").returns(model);

        run(() => {
            service.enqueue("jobname", {}).then(() => {
                assert.ok(modelSaveSpy.calledOnce);
            });
        });
    });

    test("enqueue add to pendingJobs if connection online", function (assert) {
        assert.expect(2);

        const service = this.owner.lookup("service:sync-queue");
        const pendingJobsDidChangeSpy = this.spy(service, "pendingJobsDidChange");
        const processNextSpy = this.spy(service, "_processNext");

        run(() => {
            service.enqueue("testjob", {}).then(() => {
                assert.ok(pendingJobsDidChangeSpy.calledTwice);
                assert.ok(processNextSpy.calledOnce);
            });
        });
    });

    test("enqueue doesn't add to pendingJobs if connection offline", function (assert) {
        assert.expect(2);

        const service = this.owner.lookup("service:sync-queue");
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

    test("new pendingJob execute processNext if not already processing", function (assert) {
        assert.expect(3);

        const service = this.owner.lookup("service:sync-queue");
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

    test("new pendingJob doesn't processNext if already processing", function (assert) {
        assert.expect(1);

        const service = this.owner.lookup("service:sync-queue");
        const job = SyncJobModelMock.create();
        const processNextSpy = this.spy(service, "_processNext");
        service.set("isProcessing", true);

        run(() => {
            service.get("pendingJobs").addObject(job);

            assert.equal(processNextSpy.callCount, 0);
        });
    });

    test("flush process all saved jobs", function (assert) {
        assert.expect(1);

        this.owner.register('service:store', EmberObject.extend({
            findAll() {
                return resolve([
                    SyncJobModelMock.create(),
                    SyncJobModelMock.create(),
                    SyncJobModelMock.create(),
                ]);
            },
        }));
        const service = this.owner.lookup("service:sync-queue");
        const jobProcessorSpy = this.spy(service.get('jobProcessor'), "process");

        run(() => {
            service.flush()
                   .then(() => {
                       assert.equal(jobProcessorSpy.callCount, 3);
                   });
        });
    });
});
