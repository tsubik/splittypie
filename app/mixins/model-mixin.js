import { set, get } from "@ember/object";
import { isArray } from "@ember/array";
import Mixin from "@ember/object/mixin";

export default Mixin.create({
    updateModel(json) {
        this.updateAttributes(json);
        this.updateRelationships(json);
    },

    updateAttributes(json) {
        this.eachAttribute((name) => {
            if (json.hasOwnProperty(name)) {
                set(this, name, json[name]);
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
                    set(this, name, model);
                } else if (descriptor.kind === "hasMany" && isArray(json[name])) {
                    const array = json[name];
                    let result = [];

                    if (array.length === 0) {
                        result = null;
                    } else if (typeof array[0] === "object") {
                        result = this._synchronizeWithNewArray(modelName, name, array);
                    } else {
                        result = this.store.peekAll(modelName).filter(
                            item => array.indexOf(item.get("id")) > -1
                        );
                    }
                    set(this, name, result);
                }
            }
        });
    },

    _synchronizeWithNewArray(modelName, name, newArray) {
        const currentArray = get(this, name);

        return newArray
            .map((newRecord) => {
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
