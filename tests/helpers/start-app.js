import Ember from "ember";
import Application from "../../app";
import config from "../../config/environment";
import "./wait-for-promise";
import "./reload-page";
import "./exist";
import "./identify-user-as";
import "./run-with-test-data";

export default function startApp(attrs) {
    let application;

    let attributes = Ember.merge({}, config.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    Ember.run(() => {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();

        window.localStorage.removeItem("lastEventId");
    });

    return application;
}
