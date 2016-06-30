import DS from "ember-data";
import Ember from "ember";
import SyncModel from "splittypie/mixins/sync-model";

export default DS.Model.extend(SyncModel, {
    name: DS.attr("string"),
    currency: DS.belongsTo("currency", { async: true }),
    users: DS.hasMany("user", { async: false }),
    transactions: DS.hasMany("transaction", { async: false }),
    url: Ember.computed("id", function () {
        return `https://splittypie.com/${this.get("id")}`;
    }),
});
