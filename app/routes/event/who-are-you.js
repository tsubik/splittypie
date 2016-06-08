import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    userContext: service(),

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        chooseUser(user) {
            const event = this.modelFor("event");

            this.get("userContext").changeUserContext(event, user);
            this.transitionTo("event.index", event);
        },
    },
});
