import { get, computed } from "@ember/object";
import ModelMixin from "splittypie/mixins/model-mixin";
import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";

export default Model.extend(ModelMixin, {
    name: attr("string"),
    isOffline: attr("boolean"),
    currency: belongsTo("currency", { async: true }),
    users: hasMany("user", { async: false }),
    transactions: hasMany("transaction", { async: false }),
    url: computed("id", function () {
        return `https://splittypie.com/${get(this, "id")}`;
    }),
});
