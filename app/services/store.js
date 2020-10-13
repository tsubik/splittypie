import Store from '@ember-data/store';

export default Store.extend({
    adapter: "offline/application",

    serializerFor(modelName) {
        return this._super(`offline/${modelName}`);
    },

    adapterFor(modelName) {
        return this._super(`offline/${modelName}`);
    },
});
