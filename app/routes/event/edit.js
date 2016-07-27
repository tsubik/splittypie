import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    localStorage: service(),
    notify: service(),
    eventRepository: service(),
    syncer: service(),

    model() {
        return Ember.RSVP.hash({
            event: this.modelFor("event"),
            currencies: this.store.findAll("currency"),
        });
    },

    setupController(controller, models) {
        this._super(controller, models);
        const eventForm = this.get("formFactory").createForm("event", models.event);
        controller.setProperties({
            event: eventForm,
            currencies: models.currencies,
        });
    },

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        delete(event) {
            this.get("eventRepository")
                .remove(event)
                .then(() => {
                    const storage = this.get("localStorage");
                    storage.removeItem("lastEventId");
                    this.transitionTo("index");
                    this.get("notify").success("Event has been deleted.");
                });
        },

        modelUpdated(event) {
            this.get("eventRepository").save(event)
                .then(() => {
                    this.transitionTo("event");
                    this.get("notify").success("Event has been changed");
                });
        },

        syncOnline(event) {
            this.get("syncer").pushEventOnline(event).then(() => {
                this.get("notify").success("Event was successfully synced");
            });
        },
    },
});
