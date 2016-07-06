import DS from "ember-data";
import Ember from "ember";
import ModelMixin from "splittypie/mixins/model-mixin";

export default DS.Model.extend(ModelMixin, {
    name: DS.attr("string"),
    isOffline: DS.attr("boolean"),
    currency: DS.belongsTo("currency", { async: true }),
    users: DS.hasMany("user", { async: false }),
    transactions: DS.hasMany("transaction", { async: false }),
    url: Ember.computed("id", function () {
        return `https://splittypie.com/${this.get("id")}`;
    }),
});
