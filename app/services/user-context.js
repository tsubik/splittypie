import { set, get } from "@ember/object";
import Service, { inject as service } from "@ember/service";

export default Service.extend({
    localStorage: service(),
    currentUser: null,

    save(eventId, userId) {
        this.localStorage.setItem(`event-${eventId}-current-user`, userId);
    },

    load(event) {
        const userId = this.localStorage.getItem(`event-${get(event, "id")}-current-user`);
        const user = event.users.findBy("id", userId);

        if (user) {
            set(this, "currentUser", user);
        }

        return user;
    },

    change(event, user) {
        this.save(get(event, "id"), get(user, "id"));
        set(this, "currentUser", user);
    },
});
