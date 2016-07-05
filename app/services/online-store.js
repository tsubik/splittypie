import Ember from "ember";
import DS from "ember-data";

export default DS.Store.extend({
    adapter: Ember.computed("state", function () {
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
