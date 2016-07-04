import LFAdapter from "ember-localforage-adapter/adapters/localforage";
import generateBase58 from "splittypie/utils/generate-base-58";

export default LFAdapter.extend({
    generateIdForRecord() {
        return generateBase58(5);
    },
});
