import Ember from "ember";

export default Ember.Route.extend({
    model(params) {
        return this.store.find("event", params.id);
    },

    actions: {
        willTransition() {
            return this.controller.get("model").save();
        }
    }
});
