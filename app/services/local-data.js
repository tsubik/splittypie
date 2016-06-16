import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    localStorage: service(),
    previousEvents: null,
    lastSeenEventId: null,

    init() {
        this.loadEvents();
    },

    loadEvents() {
        const events = this.get("localStorage").findAll("events");
        this.set("previousEvents", events);
    },

    pushEvent(event, userId) {
        const saveObj = Ember.Object.create(event.getProperties("id", "name"));

        if (userId) {
            saveObj.set("userId", userId);
        }

        this.get("localStorage").push("events", saveObj);
        this.loadEvents();
    },

    removeEvent(id) {
        const lastSeenEventId = this.get("lastSeenEventId");

        this.get("localStorage").remove("events", id);
        if (lastSeenEventId === id) {
            window.localStorage.removeItem("lastSeenEventId");
        }

        this.loadEvents();
    },
});
