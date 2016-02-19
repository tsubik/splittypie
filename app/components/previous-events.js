import Ember from "ember";

export default Ember.Component.extend({
    localStorage: Ember.inject.service(),
    anyEvents: Ember.computed.notEmpty("events"),

    actions: {
        remove(eventId) {
            this.get("localStorage").remove("events", eventId);
        },
    },
});
