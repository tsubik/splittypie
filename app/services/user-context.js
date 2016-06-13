import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Service.extend({
    localStorage: service(),
    currentUser: null,

    changeUserContext(event, user) {
        const localStorage = this.get("localStorage");

        localStorage.push(
            "events",
            Ember.Object.create({
                id: event.get("id"),
                name: event.get("name"),
                userId: user.get("id"),
            })
        );

        this.set("currentUser", user);
    },
});
