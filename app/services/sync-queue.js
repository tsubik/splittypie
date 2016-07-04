import Ember from "ember";

const { service } = Ember.inject;
const { debug } = Ember.Logger;

export default Ember.Service.extend({
    offlineStore: service(),
    jobProcessor: service(),

    enqueue(name, payload) {
        debug(`createing offline job for ${name}: ${payload}`);
        const job = this.get("offlineStore").createRecord("sync-job", {
            name,
            payload: JSON.stringify(payload),
        });

        job.save();
    },

    flush() {
        const jobProcessor = this.get("jobProcessor");
        debug("flushing offline job");

        return this.get("offlineStore").findAll("sync-job").then((jobs) => {
            return Ember.RSVP.all(
                jobs.map((job) => jobProcessor.process(job).then(() => job.destroyRecord()))
            );
        });
    },
});
