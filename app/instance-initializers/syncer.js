export function initialize(applicationInstance) {
    applicationInstance.lookup("service:syncer");
}

export default {
    name: "syncer",
    initialize,
};
