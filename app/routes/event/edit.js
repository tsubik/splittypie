import Ember from "ember";

const {
    inject: { service },
    get,
    setProperties,
    RSVP,
    Route,
} = Ember;

export default Route.extend({
    localStorage: service(),
    notify: service(),
    eventRepository: service(),
    syncer: service(),

    model() {
        return RSVP.hash({
            event: this.modelFor("event"),
            currencies: this.store.findAll("currency"),
        });
    },

    setupController(controller, models) {
        this._super(controller, models);
        const eventForm = get(this, "formFactory").createForm("event", models.event);
        setProperties(controller, {
            event: eventForm,
            currencies: models.currencies,
        });
    },

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        delete(event) {
            get(this, "eventRepository")
                .remove(event)
                .then(() => {
                    const storage = get(this, "localStorage");
                    storage.removeItem("lastEventId");
                    this.transitionTo("index");
                    get(this, "notify").success("Event has been deleted.");
                });
        },

        modelUpdated(event) {
            get(this, "eventRepository").save(event)
                .then(() => {
                    this.transitionTo("event");
                    get(this, "notify").success("Event has been changed");
                });
        },

        syncOnline(event) {
            get(this, "syncer").pushEventOnline(event).then(() => {
                get(this, "notify").success("Event was successfully synced");
            });
        },
    },
});
