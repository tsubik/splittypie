import { get, computed } from "@ember/object";
import ModelMixin from "splittypie/mixins/model-mixin";
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend(ModelMixin, {
    name: attr("string"),
    isOffline: attr("boolean"),
    currency: belongsTo("currency", { async: true }),
    users: hasMany("user", { async: false }),
    transactions: hasMany("transaction", { async: false }),
    url: computed("id", function () {
        return `https://splittypie.com/${this.id}`;
    }),
});
