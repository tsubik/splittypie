import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),

    model() {
        return {
            previousEvents: this.get("localStorage").findAll("events"),
        };
    },
});
