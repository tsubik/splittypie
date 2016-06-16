import LocalData from "splittypie/services/local-data";

export function initialize(application) {
    application.register("service:local-data", LocalData);

    // inject user-context to controllers
    application.inject("controller", "localData", "service:local-data");
    application.inject("route", "localData", "service:local-data");
}

export default {
    name: "local-data",
    initialize,
};
