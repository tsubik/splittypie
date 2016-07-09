import DS from "ember-data";

export default DS.Store.extend({
    adapter: "offline/application",

    serializerFor(modelName) {
        return this._super(`offline/${modelName}`);
    },

    adapterFor(modelName) {
        return this._super(`offline/${modelName}`);
    },
});
