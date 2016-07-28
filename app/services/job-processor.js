import Ember from "ember";

const {
    assert,
    get,
    inject: { service },
    Logger: { debug },
    Service,
} = Ember;

export default Service.extend({
    onlineStore: service(),
    store: service(),

    process(job) {
        const name = get(job, "name");
        const payload = JSON.parse(job.get("payload"));
        const [jobType, modelName] = name.split(/(?=[A-Z])/);
        const method = this.commands[jobType];

        debug(`processing job ${name} with payload: ${payload}`);
        assert(`Job ${name} doesn't exists`, method);

        return method.call(this, modelName, payload)
            .then((result) => {
                debug(`Job ${name} has successfully completed`);
                return result;
            })
            .catch((error) => {
                debug("Job processing error", error);
                return error;
            });
    },

    commands: {
        create(modelName, properties) {
            const onlineStore = get(this, "onlineStore");
            const offlineStore = get(this, "store");
            const modelClass = offlineStore.modelFor(modelName);
            const serializer = offlineStore.serializerFor(modelName);
            const normalized = serializer.normalize(modelClass, properties);

            return onlineStore.push(normalized).save();
        },

        update(modelName, properties) {
            const onlineStore = get(this, "onlineStore");
            const id = properties.id;

            return onlineStore.findRecord(modelName, id).then((record) => {
                record.updateModel(properties);
                return record.save();
            });
        },

        destroy(modelName, properties) {
            const onlineStore = get(this, "onlineStore");
            const id = properties.id;

            return onlineStore.findRecord(modelName, id).then((record) => record.destroyRecord());
        },
    },
});
