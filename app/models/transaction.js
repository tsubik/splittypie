import { equal } from "@ember/object/computed";
import { get, computed } from "@ember/object";
import ModelMixin from "splittypie/mixins/model-mixin";
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend(ModelMixin, {
    name: attr("string"),
    amount: attr("number"),
    date: attr("string"),
    event: belongsTo("event", { async: false }),
    payer: belongsTo("user", { async: false }),
    participants: hasMany("user", { async: false }),
    type: attr("string", { defaultValue: "expense" }),
    typeOrDefault: computed("type", {
        // FIXME: I don't like this typeOrDefault
        get() {
            return this.type || "expense";
        },
    }),

    month: computed("date", function () {
        const date = this.date;

        if (date) {
            return date.substring(0, 7);
        }

        return null;
    }),

    isTransfer: equal("type", "transfer"),
});
