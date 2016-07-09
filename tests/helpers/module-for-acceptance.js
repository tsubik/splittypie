import { module } from "qunit";
import startApp from "../helpers/start-app";
import destroyApp from "../helpers/destroy-app";

export default function (name, options = {}) {
    module(name, {
        beforeEach() {
            this.application = startApp({});
            this.store = this.application.__container__.lookup("service:store");
            const adapter = this.application.__container__.lookup("adapter:offline/application");
            adapter.get("cache").clear();
            window.localStorage.clear();
            window.localforage.clear();

            if (options.beforeEach) {
                options.beforeEach.apply(this, arguments);
            }
        },

        afterEach() {
            destroyApp(this.application);
            window.localStorage.clear();
            window.localforage.clear();

            if (options.afterEach) {
                options.afterEach.apply(this, arguments);
            }
        },
    });
}
