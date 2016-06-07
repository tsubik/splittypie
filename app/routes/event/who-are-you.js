import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        chooseUser(user) {
            const event = this.modelFor("event");
            const localStorage = this.get("localStorage");

            localStorage.push(
                "events",
                Ember.Object.create({
                    id: event.get("id"),
                    name: event.get("name"),
                    userId: user.get("id"),
                })
            );

            this.controllerFor("event").set("currentUser", user);
            this.transitionTo("event.index", event);
        },
    },
});
