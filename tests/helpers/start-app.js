import { run } from "@ember/runloop";
import { merge } from "@ember/polyfills";
import Application from "../../app";
import config from "../../config/environment";
import "./wait-for-promise";
import "./reload-page";
import "./exist";
import "./identify-user-as";
import "./run-with-test-data";
import "./set-event-as-viewed";
import "./run-and-wait-for-sync-queue-to-flush";

export default function startApp(attrs) {
    let application;

    let attributes = merge({}, config.APP);
    attributes = merge(attributes, attrs); // use defaults, but you can override;

    run(() => {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();

        window.localStorage.removeItem("lastEventId");
    });

    return application;
}
