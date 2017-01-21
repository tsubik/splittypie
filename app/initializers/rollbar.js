/* eslint-disable no-console */
import Ember from "ember";

const { RSVP } = Ember;

function shouldReportError(error) {
    if (error.message && error.message.indexOf("no record was found") > -1) {
        return false;
    }

    if (error.name === "TransitionAborted") {
        return false;
    }

    return true;
}

function reportError(error) {
    if (error.stack) {
        console.error(error);
    }

    if (window.Rollbar && shouldReportError(error)) {
        window.Rollbar.error(error);
    }

    return true;
}

export function initialize(application) {
    const syncQueue = application.__container__.lookup("service:syncQueue");

    syncQueue.on("error", reportError);
    Ember.onerror = reportError;
    window.onerror = reportError;
    RSVP.on("error", reportError);
}

export default {
    name: "rollbar",
    initialize,
};
