import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Mixin.create({
    syncQueue: service(),
    connection: service(),
    isOffline: Ember.computed.alias("connection.isOffline"),

    onSaved(record) {
        if (this.get("isOffline")) {
            const properties = record.serialize();
            const operation = record.get("isNew") ? "create" : "update";
            const modelName = record.modelName;

            this.get("syncQueue").enqueue(modelName, properties, operation);
        }

        return record;
    },

    onRemoved(record) {
        debugger;
        const id = record.get("id");
        const modelName = record.modelName;

        if (this.get("isOffline")) {
            this.get("syncQueue").enqueue(modelName, { id }, "delete");
        }

        return record;
    },
});
