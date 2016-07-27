import Ember from "ember";

const { service } = Ember.inject;
const { debug } = Ember.Logger;

export default Ember.Service.extend(Ember.Evented, {
    store: service(),
    jobProcessor: service(),
    connection: service(),
    pendingJobs: null,
    isProcessing: false,

    init() {
        this._super(...arguments);
        this.set("pendingJobs", []);
    },

    enqueue(name, payload) {
        debug(`creating offline job for ${name}: ${payload}`);
        return this._createAndSaveJob(name, payload).then((job) => {
            if (this.get("connection.isOnline")) {
                debug(`adding job ${name} to pendingJobs array`);
                this.get("pendingJobs").addObject(job);
            }
        });
    },

    flush() {
        debug("flushing offline jobs");

        return new Ember.RSVP.Promise((resolve) => {
            this.get("store")
                .findAll("sync-job")
                .then((jobs) => {
                    const arrayJobs = jobs.sortBy("createdAt").toArray();

                    if (arrayJobs.length === 0) {
                        debug("no jobs to flush");
                        resolve();
                    } else {
                        this.one("flushed", resolve);
                        this.get("pendingJobs").pushObjects(arrayJobs);
                    }
                });
        });
    },

    pendingJobsDidChange: Ember.observer("pendingJobs.[]", function () {
        const isProcessing = this.get("isProcessing");

        if (!isProcessing) {
            this._processNext();
        }
    }),

    _processNext() {
        const jobProcessor = this.get("jobProcessor");
        const pendingJobs = this.get("pendingJobs");
        const job = pendingJobs.objectAt(0);

        if (!job) {
            return;
        }

        this.set("isProcessing", true);
        jobProcessor
            .process(job)
            .then(() => {
                this.get("pendingJobs").removeAt(0);
                const anyNextJobs = this.get("pendingJobs.length") > 0;
                job.destroyRecord();
                if (anyNextJobs) {
                    this._processNext();
                } else {
                    this.set("isProcessing", false);
                    debug("Sync queue is flushed");
                    this.trigger("flushed");
                }
            })
            .catch((error) => {
                debug("ERROR", error);
            });
    },

    _createAndSaveJob(name, payload) {
        const job = this.get("store").createRecord("sync-job", {
            name,
            payload: JSON.stringify(payload),
        });

        return job.save();
    },
});
