import Ember from "ember";

export default Ember.Route.extend({
    setupController(controller, models) {
        this._super(controller, models);
        controller.setProperties({
            currencies: this.modelFor("application").currencies
        });
    },

    actions: {
        addUser() {
            const event = this.modelFor("event");
            const newUser = this.store.createRecord("user");

            event.get("users").pushObject(newUser);
        },

        saveChanges() {
            const event = this.modelFor("event");

            event.save().then(() => this.transitionTo("event.overview"));
        },

        willTransition() {
            const event = this.modelFor("event");

            event.rollbackAttributes();
        }
    }
});
