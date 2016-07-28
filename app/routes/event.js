import Ember from "ember";
import isMobile from "splittypie/utils/is-mobile";

const {
    inject: { service },
    get,
    setProperties,
    Route,
} = Ember;

export default Route.extend({
    localStorage: service(),
    userContext: service(),
    modal: service(),
    notify: service(),
    eventRepository: service(),
    connection: service(),
    syncer: service(),

    model(params) {
        return get(this, "eventRepository").find(params.event_id);
    },

    afterModel(model) {
        const storage = get(this, "localStorage");
        storage.setItem("lastEventId", model.id);
    },

    redirect(model) {
        const currentUser = get(this, "userContext").load(model);

        if (!currentUser) {
            this.transitionTo("event.who-are-you");
        }
    },

    setupController(controller) {
        this._super(...arguments);
        const events = this.modelFor("application").previousEvents;

        setProperties(controller, {
            events,
            isMobile: isMobile(),
        });
    },

    actions: {
        share() {
            const event = this.modelFor("event");

            get(this, "modal").trigger("show", {
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

            get(this, "userContext").change(event, user);
            get(this, "notify").success(`Now you are watching this event as ${user.get("name")}`);
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const storage = get(this, "localStorage");
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
