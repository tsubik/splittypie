import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
    location: config.locationType,
});

Router.map(function () {
    this.route("event", {
        path: "/:id",
    }, function () {
        this.route("overview");
        this.route("transactions", function () {
            this.route("new");
            this.route("edit", { path: "/:transactionId" });
        });
        this.route("edit");
    });
    this.route("new");
});

export default Router;
