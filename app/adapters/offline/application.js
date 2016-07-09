import LFAdapter from "ember-localforage-adapter/adapters/localforage";
import generateUniqueId from "splittypie/utils/generate-unique-id";

export default LFAdapter.extend({
    generateIdForRecord() {
        return generateUniqueId();
    },
});
