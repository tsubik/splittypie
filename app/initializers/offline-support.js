/* eslint-disable no-param-reassign, max-len */
import Ember from "ember";

const { Logger: { error, debug } } = Ember;

export default {
    name: "offline-support",
    initialize(application) {
        const notify = application.__container__.lookup("service:notify");

        if ("serviceWorker" in window.navigator) {
            window.navigator.serviceWorker.register("/offline-support.js").then((registration) => {
                const isUpdate = !!registration.active;

                registration.onupdatefound = function () {
                    debug("A new Service Worker version has been found...");

                    registration.installing.onstatechange = function () {
                        if (this.state === "installed") {
                            debug("Service Worker Installed.");

                            if (isUpdate) {
                                notify.info(
                                    "Application has been updated. Please reload page for the new version.",
                                    { closeAfter: null }
                                );
                            } else {
                                notify.success("App ready for offline use.");
                            }
                        } else {
                            debug("New Service Worker state: ", this.state);
                        }
                    };
                };
            }).catch((err) => {
                error(err);
            });
        }
    },
};
