export function initialize(applicationInstance) {
    console.debug("initialize syncer");
    applicationInstance.lookup("service:syncer");
}

export default {
    name: "syncer",
    initialize,
};
