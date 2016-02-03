import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),

    model(params) {
        return this.store.find("event", params.event_id);
    },

    afterModel(model) {
        this.get("localStorage").push(
            "events",
            Ember.Object.create(model.getProperties("id", "name"))
        );
    },

    actions: {
        saveChanges() {
            const event = this.modelFor("event");

            event.save();
        },
    },
});
