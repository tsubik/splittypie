/* eslint-disable no-console */
import RSVP from "rsvp";

import Ember from "ember";

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
    if (Ember.testing) {
        throw error;
    }

    if (shouldReportError(error)) {
        if (error.stack) {
            console.error(error);
            console.error(error.stack);
        }

        if (window.Rollbar) {
            window.Rollbar.error(error);
        }
    }

    return true;
}

export function initialize(applicationInstance) {
    console.debug("initialize rollbar");
    const syncQueue = applicationInstance.lookup("service:syncQueue");

    syncQueue.on("error", reportError);
    Ember.onerror = reportError;
    window.onerror = reportError;
    RSVP.on("error", reportError);
}

export default {
    name: "rollbar",
    initialize,
};
