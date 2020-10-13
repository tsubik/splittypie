import { computed } from "@ember/object";
import DS from "ember-data";

const { Store } = DS;

export default Store.extend({
    adapter: computed("state", function () {
        return "online/application";
    }),

    serializerFor(modelName) {
        return this._super(`online/${modelName}`);
    },

    adapterFor(modelName) {
        return this._super(`online/${modelName}`);
    },
});
