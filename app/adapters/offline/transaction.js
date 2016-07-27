import Ember from "ember";
import LFAdapter from "ember-localforage-adapter/adapters/localforage";
import generateUniqueId from "splittypie/utils/generate-unique-id";

const {
    RSVP: { resolve },
} = Ember;

export default LFAdapter.extend({
    generateIdForRecord: generateUniqueId,

    updateRecord() {
        return resolve();
    },

    createRecord() {
        return resolve();
    },
});
