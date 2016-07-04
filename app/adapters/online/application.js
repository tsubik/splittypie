import FirebaseAdapter from "emberfire/adapters/firebase";
import generateBase58 from "splittypie/utils/generate-base-58";

export default FirebaseAdapter.extend({
    generateIdForRecord() {
        return generateBase58(5);
    },
});
