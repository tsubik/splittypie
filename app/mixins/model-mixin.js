import Ember from "ember";

export default Ember.Mixin.create({
    updateModel(json) {
        this.updateAttributes(json);
        this.updateRelationships(json);
    },

    updateAttributes(json) {
        this.eachAttribute((name) => {
            if (json.hasOwnProperty(name)) {
                this.set(name, json[name]);
            }
        });
    },

    updateRelationships(json) {
        this.eachRelationship((name, descriptor) => {
            if (json.hasOwnProperty(name)) {
                const modelName = descriptor.type;

                if (descriptor.kind === "belongsTo") {
                    const id = json[name];
                    const model = this.store.peekRecord(modelName, id);
                    this.set(name, model);
                } else if (descriptor.kind === "hasMany" && Ember.isArray(json[name])) {
                    const array = json[name];
                    let result = [];

                    if (array.length === 0) {
                        result = null;
                    } else if (typeof array[0] === "object") {
                        result = this._synchronizeWithNewArray(modelName, name, array);
                    } else {
                        result = this.store.peekAll(modelName).filter(
                            (item) => array.indexOf(item.get("id")) > -1
                        );
                    }
                    this.set(name, result);
                }
            }
        });
    },

    _synchronizeWithNewArray(modelName, name, newArray) {
        const currentArray = this.get(name);

        return newArray
            .map(newRecord => {
                let record = currentArray.findBy("id", newRecord.id);

                if (record) {
                    record.updateAttributes(newRecord);
                } else {
                    record = this.store.createRecord(modelName, newRecord);
                }

                return record;
            });
    },
});
