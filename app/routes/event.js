import Ember from "ember";

export default Ember.Route.extend({
    model(params) {
        return this.store.find("event", params.event_id);
    },

    actions: {
        saveChanges() {
            const event = this.modelFor("event");

            event.save();
        },
    },
});
