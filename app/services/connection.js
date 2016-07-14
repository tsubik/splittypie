import Ember from "ember";

const {
    computed: { equal },
    Service,
} = Ember;

export default Service.extend({
    state: "offline",
    isOnline: equal("state", "online"),
    isOffline: equal("state", "offline"),

    init() {
        this._super(...arguments);
        this.set("state", window.navigator.onLine ? "online" : "offline");
        this._onOfflineHandler = () => {
            this.set("state", "offline");
        };
        this._onOnlineHandler = () => {
            this.set("state", "online");
        };

        window.addEventListener("offline", this._onOfflineHandler);
        window.addEventListener("online", this._onOnlineHandler);
    },

    destroy() {
        window.removeEventListener("offline", this._onOfflineHandler);
        window.removeEventListener("online", this._onOnlineHandler);
        this._super(...arguments);
    },
});
