import Ember from "ember";

const { service } = Ember.inject;
const { debug } = Ember.Logger;

export default Ember.Service.extend(Ember.Evented, {
    store: service(),
    jobProcessor: service(),
    connection: service(),
    pendingJobs: null,

    init() {
        this._super(...arguments);
        this.set("pendingJobs", []);
    },

    enqueue(name, payload) {
        debug(`creating offline job for ${name}: ${payload}`);
        const job = this.get("store").createRecord("sync-job", {
            name,
            payload: JSON.stringify(payload),
        });

        if (this.get("connection.isOnline")) {
            this.get("pendingJobs").addObject(job);
        } else {
            job.save();
        }
    },

    flush() {
        debug("flushing offline job");

        return new Ember.RSVP.Promise((resolve) => {
            this.get("store")
                .findAll("sync-job")
                .then((jobs) => {
                    this.get("pendingJobs").pushObjects(jobs.toArray());
                    this.one("pendingJobs:flushed", resolve);
                });
        });
    },

    pendingJobsDidChange: Ember.observer("pendingJobs.[]", function () {
        const isProcessing = this.get("isProcessing");

        if (!isProcessing) {
            this.processNext();
        }
    }),

    processNext() {
        const jobProcessor = this.get("jobProcessor");
        const pendingJobs = this.get("pendingJobs");
        const job = pendingJobs.popObject();

        if (!job) {
            return;
        }

        this.set("isProcessing", true);
        jobProcessor
            .process(job)
            .then(() => {
                job.destroyRecord();
                this.set("isProcessing", false);
                if (pendingJobs.length === 0) {
                    debug("FLUSHED");
                    this.trigger("pendingJobs:flushed");
                } else {
                    this.processNext();
                }
            });
    },
});
