import Ember from "ember";

export function initialize(applicationInstance) {
    Ember.debug("initialize syncer");
    applicationInstance.lookup("service:syncer");
}

export default {
    name: "syncer",
    initialize,
};
