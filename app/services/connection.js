import Ember from "ember";

export default Ember.Service.extend({
    state: "offline",
    isOnline: Ember.computed.equal("state", "online"),
    isOffline: Ember.computed.equal("state", "offline"),

    init() {
        this._super(...arguments);
        this.set("state", navigator.onLine ? "online" : "offline");

        window.addEventListener("offline", () => {
            this.set("state", "offline");
        });
        window.addEventListener("online", () => {
            this.set("state", "online");
        });
    },
});
