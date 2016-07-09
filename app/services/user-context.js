import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    localStorage: service(),
    currentUser: null,

    save(eventId, userId) {
        this.get("localStorage").setItem(`event-${eventId}-current-user`, userId);
    },

    load(event) {
        const userId = this.get("localStorage").getItem(`event-${event.get("id")}-current-user`);
        const user = event.get("users").findBy("id", userId);

        if (user) {
            this.set("currentUser", user);
        }

        return user;
    },

    change(event, user) {
        this.save(event.get("id"), user.get("id"));
        this.set("currentUser", user);
    },
});
