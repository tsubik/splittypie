import Ember from "ember";

const {
    inject: { service },
    get,
    Route,
} = Ember;

export default Route.extend({
    userContext: service(),

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        chooseUser(user) {
            const event = this.modelFor("event");

            get(this, "userContext").change(event, user);
            this.transitionTo("event.index", event);
        },
    },
});
