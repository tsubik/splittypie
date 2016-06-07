import Ember from "ember";

export default Ember.Route.extend({
    localStorage: Ember.inject.service(),
    modal: Ember.inject.service(),

    model(params) {
        return this.store.find("event", params.event_id);
    },

    afterModel(model) {
        const eventLS = this.get("localStorage").find("events", model.id);

        window.localStorage.setItem("lastEventId", model.id);

        if (!(eventLS && eventLS.userId)) {
            this.transitionTo("event.who-are-you");
        }
    },

    setupController(controller, model) {
        this._super(...arguments);
        const events = this.modelFor("application").previousEvents;
        const eventLS = this.get("localStorage").find("events", model.id);

        if (eventLS) {
            const currentUser = this.store.find("user", eventLS.userId);

            controller.setProperties({ currentUser });
        }

        controller.setProperties({
            events,
        });
    },

    actions: {
        share() {
            const event = this.modelFor("event");

            this.get("modal").trigger("show", {
                name: "share",
                event,
            });
        },

        saveChanges() {
            const event = this.modelFor("event");

            event.save();
        },

        switchUser(user) {
            const event = this.modelFor("event");
            const eventLS = this.get("localStorage").find("events", event.get("id"));

            eventLS.set("userId", user.get("id"));
            this.get("localStorage").push("events", eventLS);
            this.controllerFor("event").set("currentUser", user);
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const lastEventId = window.localStorage.getItem("lastEventId");

            if (error.message &&
                error.message.indexOf("no record was found") > -1
                && eventId === lastEventId) {
                window.localStorage.removeItem("lastEventId");
                this.transitionTo("index");
            } else {
                return true;
            }

            return false;
        },
    },
});
