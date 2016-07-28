import Ember from "ember";

const { debug } = Ember;

export function initialize(applicationInstance) {
    debug("initialize syncer");
    applicationInstance.lookup("service:syncer");
}

export default {
    name: "syncer",
    initialize,
};
