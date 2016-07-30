/* eslint array-callback-return:0 */

import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL,
});

Router.map(function () {
    // FIXME: wait for ember 2.7.1 and move this wildcard at the end
    // there is some bug/feature in 2.7.0, but after moving wildcard here
    // looks like everything works correctly
    this.route("not-found", { path: "/*wildcard" });
    this.route("event", {
        path: "/:event_id",
    }, function () {
        this.route("transactions", function () {
            this.route("new");
            this.route("edit", { path: "/:transaction_id" });
        });
        this.route("edit");
        this.route("who-are-you");
    });
    this.route("new");
});

export default Router;
