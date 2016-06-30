import DS from "ember-data";
import Ember from "ember";

const { service } = Ember.inject;

// const OfflineStore = DS.Store.extend({
//     adapter: Ember.computed("state", function () {
//         return "offline/application";
//     }),

//     serializerFor(modelName) {
//         return this._super(`offline/${modelName}`);
//     },

//     adapterFor(modelName) {
//         return this._super(`offline/${modelName}`);
//     },
// });

// const OnlineStore = DS.Store.extend({
//     adapter: Ember.computed("state", function () {
//         return "online/application";
//     }),

//     serializerFor(modelName) {
//         return this._super(`online/${modelName}`);
//     },

//     adapterFor(modelName) {
//         return this._super(`online/${modelName}`);
//     },
// });

export default DS.Store.extend({
    state: "offline",
    offlineStore: service(),
    syncer: service(),

    didStateChange: Ember.on("init", Ember.observer("state", function () {
        const state = this.get("state");

        if (state === "online") {
            this.get("syncer").syncEvents();
        }
    })),

    adapter: Ember.computed("state", function () {
        return `${this.get("state")}/application`;
    }),

    init() {
        this._super(...arguments);
        this.set("state", navigator.onLine ? "online" : "offline");

        window.addEventListener("offline", () => {
            this.set("state", "offline");
        });
        window.addEventListener("online", () => {
            this.set("state", "online");
        });
    },

    serializerFor(modelName) {
        const state = this.get("state");
        return this._super(`${state}/${modelName}`);
    },

    adapterFor(modelName) {
        const state = this.get("state");
        return this._super(`${state}/${modelName}`);
    },

    dataWasUpdated(type, internalModel) {
        this._super(...arguments);
        const state = this.get("state");
        const modelName = internalModel.modelName;
        const isPendingSave = this._pendingSave.length > 0;

        if (state === "online" && !isPendingSave &&
            (modelName === "event")) {
            this.get("syncer").syncDown(internalModel.id);
        }
    },

    scheduleSave() {
        const state = this.get("state");

        this._super(...arguments);
        if (state === "online") {
            this.get("offlineStore").scheduleSave(...arguments);
        }
    },
});
