import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend({
    name: DS.attr("string"),
    currency: DS.belongsTo("currency", { async: true }),
    users: DS.hasMany("user", { async: false }),
    transactions: DS.hasMany("transaction", { async: false }),
    url: Ember.computed("id", function () {
        return `https://splittypie.com/${this.get("id")}`;
    }),

    updateAttributes(json) {
        this.eachAttribute((name) => {
            if (json.hasOwnProperty(name)) {
                this.set(name, json[name]);
            }
        });
    },
});
