import DS from "ember-data";
import Ember from "ember";

const { service } = Ember.inject;

export default DS.Store.extend({
    offlineStore: service(),
    syncer: service(),
    syncQueue: service(),
    connection: service(),
    isOnline: Ember.computed.alias("connection.isOnline"),
    isOffline: Ember.computed.alias("connection.isOffline"),

    adapter: Ember.computed("connection.state", function () {
        return `${this.get("connection.state")}/application`;
    }),

    serializerFor(modelName) {
        const state = this.get("connection.state");
        return this._super(`${state}/${modelName}`);
    },

    adapterFor(modelName) {
        const state = this.get("connection.state");
        return this._super(`${state}/${modelName}`);
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
    scheduleSave() {
        this._super(...arguments);
        if (this.get("isOnline")) {
            this.get("offlineStore").scheduleSave(...arguments);
        }
    },
});
