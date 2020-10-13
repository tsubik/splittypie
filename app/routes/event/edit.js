import { inject as service } from "@ember/service";
import { setProperties, get } from "@ember/object";
import RSVP from "rsvp";
import Route from "@ember/routing/route";

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
        const eventForm = this.formFactory.createForm("event", models.event);
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
            this.eventRepository
                .remove(event)
                .then(() => {
                    const storage = this.localStorage;
                    storage.removeItem("lastEventId");
                    this.transitionTo("index");
                    this.notify.success("Event has been deleted.");
                });
        },

        modelUpdated(event) {
            this.eventRepository.save(event)
                .then(() => {
                    this.transitionTo("event");
                    this.notify.success("Event has been changed");
                });
        },

        syncOnline(event) {
            this.syncer.pushEventOnline(event).then(() => {
                this.notify.success("Event was successfully synced");
            });
        },
    },
});
