import Ember from "ember";
import isMobile from "splittypie/utils/is-mobile";

const { service } = Ember.inject;

export default Ember.Route.extend({
    localStorage: service(),
    userContext: service(),
    modal: service(),
    notify: service(),
    eventRepository: service(),
    connection: service(),
    syncer: service(),

    model(params) {
        return this.get("eventRepository").find(params.event_id);
    },

    afterModel(model) {
        const storage = this.get("localStorage");
        storage.setItem("lastEventId", model.id);
    },

    redirect(model) {
        const currentUser = this.get("userContext").load(model);

        if (!currentUser) {
            this.transitionTo("event.who-are-you");
        }
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

            this.get("userContext").change(event, user);
            this.get("notify").success(`Now you are watching this event as ${user.get("name")}`);
        },

        // FIXME: REMOVE THIS, ONLY FOR TESTING
        toggleConnection() {
            if (this.get("connection.isOffline")) {
                this.set("connection.state", "online");
                this.get("syncer").syncOnline();
            } else {
                this.set("connection.state", "offline");
            }
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const storage = this.get("localStorage");
            const lastEventId = storage.getItem("lastEventId");

            // FIXME: Do this better
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
