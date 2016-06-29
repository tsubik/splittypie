import Ember from "ember";
import isMobile from "splittypie/utils/is-mobile";

const { service } = Ember.inject;

export default Ember.Route.extend({
    localStorage: service(),
    userContext: service(),
    modal: service(),
    notify: service(),

    model(params) {
        return this.store.findRecord("event", params.event_id);
    },

    redirect(model) {
        const storage = this.get("localStorage");
        const eventLS = storage.find("events", model.id);

        storage.setItem("lastEventId", model.id);

        if (!(eventLS && eventLS.userId)) {
            this.transitionTo("event.who-are-you");
        } else {
            return this.store.findRecord("user", eventLS.userId).then((currentUser) => {
                this.get("userContext").set("currentUser", currentUser);
            });
        }

        return null;
    },

    setupController(controller) {
        this._super(...arguments);
        const events = this.modelFor("application").previousEvents;

        controller.setProperties({
            events,
            isMobile: isMobile(),
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

            this.get("userContext").changeUserContext(event, user);
            this.get("notify").success(`Now you are watching this event as ${user.get("name")}`);
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const storage = this.get("localStorage");
            const lastEventId = storage.getItem("lastEventId");

            if (error.message &&
                error.message.indexOf("no record was found") > -1
                && eventId === lastEventId) {
                storage.removeItem("lastEventId");
                this.transitionTo("index");
            } else {
                return true;
            }

            return false;
        },
    },
});
