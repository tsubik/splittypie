import Ember from "ember";
import DS from "ember-data";

const { Store } = DS;
const { computed } = Ember;

export default Store.extend({
    adapter: computed("state", function () {
        return "online/application";
    }),

    init() {
        this._super(...arguments);
        this.findAll("currency");
    },

    serializerFor(modelName) {
        return this._super(`online/${modelName}`);
    },

    adapterFor(modelName) {
        return this._super(`online/${modelName}`);
    },
});
