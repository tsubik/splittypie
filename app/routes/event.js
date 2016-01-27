import Ember from "ember";

export default Ember.Route.extend({
    model(params) {
        return this.store.find("event", params.id);
    },

    actions: {
        saveChanges() {
            const event = this.modelFor("event");

            event.save();
        },
    },
});
