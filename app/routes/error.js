import Ember from "ember";

export default Ember.Route.extend({
    setupController(controller, model) {
        const errorName = this.getErrorName(model);

        controller.set("partialName", `shared/errors/${errorName}`);
    },

    getErrorName(error) {
        if (error) {
            if (error.message && error.message.indexOf("no record was found") > -1) {
                return "not-found";
            }
        }

        return "unknown";
    },
});
