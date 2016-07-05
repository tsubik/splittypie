import DS from "ember-data";
import Ember from "ember";

export default DS.Store.extend({
    adapter: "offline/application",

    serializerFor(modelName) {
        return this._super(`offline/${modelName}`);
    },

    adapterFor(modelName) {
        return this._super(`offline/${modelName}`);
    },

    // dataWasUpdated(type, internalModel) {
    //     this._super(...arguments);
    //     const state = this.get("state");
    //     const modelName = internalModel.modelName;
    //     const isPendingSave = this._pendingSave.length > 0;

    //     if (state === "online" && !isPendingSave &&
    //         (modelName === "event")) {
    //         this.get("syncer").syncDown(internalModel.id);
    //     }
    // },

    // to mirror save into online and offlineStore
    // scheduleSave() {
    //     this._super(...arguments);
    //     if (this.get("isOnline")) {
    //         Ember.Logger.debug("Scheduling save into offline store");
    //         this.get("offlineStore").scheduleSave(...arguments);
    //     }
    // },
});
