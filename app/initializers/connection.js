// FIXME: REMOVE THIS LATER
import Connection from "splittypie/services/connection";

export function initialize(application) {
    application.register("service:connection", Connection);

    // inject user-context to controllers
    application.inject("controller", "connection", "service:connection");
}

export default {
    name: "connection",
    initialize,
};
