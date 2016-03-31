/* eslint-disable no-console */
import Ember from "ember";

function shouldReportError(error) {
    if (error.message && error.message.indexOf("no record was found") > -1) {
        return false;
    }

    return true;
}

export function initialize(/* application */) {
    const reportError = (error) => {
        console.error(error);

        if (window.Rollbar && shouldReportError(error)) {
            window.Rollbar.error(error);
        }

        return true;
    };

    Ember.onerror = reportError;
    Ember.RSVP.on("error", reportError);
    window.onerror = reportError;
}

export default {
    name: "rollbar",
    initialize,
};
