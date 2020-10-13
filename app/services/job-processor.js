import { assert } from "@ember/debug";
import Service, { inject as service } from "@ember/service";

export default Service.extend({
    onlineStore: service(),
    store: service(),

    process(job) {
        const name = job.name;
        const payload = JSON.parse(job.get("payload"));
        const [jobType, modelName] = name.split(/(?=[A-Z])/);
        const method = this.commands[jobType];

        console.debug(`Job-processor: Processing job ${name} with payload`, payload);
        assert(`Job ${name} doesn't exists`, method);

        return method.call(this, modelName, payload)
            .then((result) => {
                console.debug(`Job-processor: Job ${name} has successfully completed`);
                return result;
            })
            .catch((error) => {
                console.debug("Job-processor: Job processing error", error);
                throw error;
            });
    },

    commands: { // eslint-disable-line
        create(modelName, properties) {
            const onlineStore = this.onlineStore;
            const offlineStore = this.store;
            const modelClass = offlineStore.modelFor(modelName);
            const serializer = offlineStore.serializerFor(modelName);
            const normalized = serializer.normalize(modelClass, properties);

            return onlineStore.push(normalized).save();
        },

        update(modelName, properties) {
            const onlineStore = this.onlineStore;
            const id = properties.id;

            return onlineStore.findRecord(modelName, id).then((record) => {
                record.updateModel(properties);
                return record.save();
            });
        },

        destroy(modelName, properties) {
            const onlineStore = this.onlineStore;
            const id = properties.id;

            return onlineStore
                .findRecord(modelName, id)
                .then(
                    record => record.destroyRecord()
                );
        },
    },
});
