import Store from '@ember-data/store';
import { computed } from "@ember/object";

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
