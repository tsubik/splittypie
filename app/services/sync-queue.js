import { Promise } from "rsvp";
import { observer, set, get } from "@ember/object";
import Evented from "@ember/object/evented";
import Service, { inject as service } from "@ember/service";
import Ember from "ember";

const {
    Logger: { debug }
} = Ember;

export default Service.extend(Evented, {
    store: service(),
    jobProcessor: service(),
    connection: service(),
    pendingJobs: null,
    isProcessing: false,

    init() {
        this._super(...arguments);
        set(this, "pendingJobs", []);
    },

    enqueue(name, payload) {
        debug(`Sync-queue: Creating offline job for ${name}: `, payload);
        return this._createAndSaveJob(name, payload).then((job) => {
            if (this.connection.isOnline) {
                debug(`Sync-queue: Adding job ${name} to pendingJobs array`);
                this.pendingJobs.addObject(job);
            }
        });
    },

    flush() {
        debug("Sync-queue: Flushing offline jobs");

        return new Promise((resolve) => {
            this.store
                .findAll("sync-job")
                .then((jobs) => {
                    const arrayJobs = jobs.sortBy("createdAt").toArray();

                    if (arrayJobs.length === 0) {
                        debug("Sync-queue: No jobs to flush");
                        resolve();
                    } else {
                        this.one("flushed", resolve);
                        this.pendingJobs.pushObjects(arrayJobs);
                    }
                });
        });
    },

    pendingJobsDidChange: observer("pendingJobs.[]", function () {
        const isProcessing = this.isProcessing;

        if (!isProcessing) {
            this._processNext();
        }
    }),

    _processNext() {
        const jobProcessor = this.jobProcessor;
        const pendingJobs = this.pendingJobs;
        const job = pendingJobs.objectAt(0);

        if (!job) {
            return;
        }

        this.set("isProcessing", true);
        jobProcessor
            .process(job)
            .catch((error) => {
                this.trigger("error", error);
            })
            .finally(() => {
                this.pendingJobs.removeAt(0);
                const moreJobsToProcess = this.pendingJobs.length > 0;

                job.destroyRecord().then(() => {
                    if (moreJobsToProcess) {
                        this._processNext();
                    } else {
                        set(this, "isProcessing", false);
                        debug("Sync-queue: Sync queue is flushed");
                        this.trigger("flushed");
                    }
                });
            });
    },

    _createAndSaveJob(name, payload) {
        const job = this.store.createRecord("sync-job", {
            name,
            payload: JSON.stringify(payload),
        });

        return job.save();
    },
});
