import Ember from "ember";

export default Ember.Route.extend({
    renderTemplate() {
        this._super(...arguments);
        this.render("shared/footer", { into: "application", outlet: "footer" });
    },

    setupController(controller) {
        this._super(...arguments);

        const previousEvents = this.modelFor("application").previousEvents;

        controller.setProperties({ previousEvents });
    },
});
