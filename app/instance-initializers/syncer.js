import { debug } from "@ember/debug";

export function initialize(applicationInstance) {
    debug("initialize syncer");
    applicationInstance.lookup("service:syncer");
}

export default {
    name: "syncer",
    initialize,
};
