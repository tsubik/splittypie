import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend({
    name: DS.attr("string"),
    amount: DS.attr("number"),
    date: DS.attr("string"),
    event: DS.belongsTo("event", { async: false }),
    payer: DS.belongsTo("user", { async: false }),
    participants: DS.hasMany("user", { async: false }),
    type: DS.attr("string", { defaultValue: "expense" }),
    typeOrDefault: Ember.computed("type", {
        get() {
            return this.get("type") || "expense";
        },
    }),

    month: Ember.computed("date", function () {
        const date = this.get("date");

        if (date) {
            return date.substring(0, 7);
        }

        return null;
    }),

    isTransfer: Ember.computed.equal("type", "transfer"),

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
                    const ids = json[name];
                    const array = this.store.peekAll(modelName).filter(
                        (item) => ids.indexOf(item.get("id")) > -1
                    );
                    this.set(name, array);
                }
            }
        });
    },

    updateModel(json) {
        this.updateAttributes(json);
        this.updateRelationships(json);
    },
});
