import { set } from "@ember/object";
import Route from "@ember/routing/route";

export default Route.extend({
    setupController(controller, model) {
        const errorName = this.getErrorName(model);

        set(controller, "partialName", `shared/errors/${errorName}`);
    },

    getErrorName(error) {
        if (error && error.message) {
            if (error.message.indexOf("no record was found") > -1) {
                return "not-found";
            }
        }

        return "unknown";
    },
});
