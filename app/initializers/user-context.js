import UserContext from "splittypie/services/user-context";

export function initialize(application) {
    application.register("service:user-context", UserContext);

    // inject user-context to controllers
    application.inject("controller", "userContext", "service:user-context");
}

export default {
    name: "user-context",
    initialize,
};
