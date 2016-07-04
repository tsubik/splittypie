import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    offlineStore: service(),
    jobProcessor: service(),

    enqueue(name, payload) {
        const job = this.get("offlineStore").createRecord("sync-job", {
            name,
            payload: JSON.stringify(payload),
        });

        job.save();
    },

    flush() {
        const jobProcessor = this.get("jobProcessor");

        this.get("offlineStore").findAll("sync-job").then((jobs) => {
            jobs.forEach((job) => {
                jobProcessor.process(job).then(() => job.destroyRecord());
            });
        });
    },
});
