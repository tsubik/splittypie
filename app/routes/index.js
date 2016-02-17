import Ember from "ember";

export default Ember.Route.extend({
    setupController(controller) {
        this._super(...arguments);

        const previousEvents = this.modelFor("application").previousEvents;

        controller.setProperties({ previousEvents });
    },
});
