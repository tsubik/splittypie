import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    localStorage: service(),
    userContext: service(),
    modal: service(),
    notify: service(),

    model(params) {
        return this.store.find("event", params.event_id);
    },

    afterModel(model) {
        const eventLS = this.get("localStorage").find("events", model.id);

        window.localStorage.setItem("lastSeenEventId", model.id);

        if (!(eventLS && eventLS.userId)) {
            this.transitionTo("event.who-are-you");
        } else {
            return this.store.find("user", eventLS.userId).then((currentUser) => {
                this.get("userContext").set("currentUser", currentUser);
            });
        }

        return null;
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

            this.get("userContext").changeUserContext(event, user);
            this.get("notify").success(`Now you are watching this event as ${user.get("name")}`);
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const lastEventId = window.localStorage.getItem("lastEventId");

            if (error.message &&
                error.message.indexOf("no record was found") > -1
                && eventId === lastEventId) {
                window.localStorage.removeItem("lastSeenEventId");
                this.transitionTo("index");
            } else {
                return true;
            }

            return false;
        },
    },
});
