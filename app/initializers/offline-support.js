/* eslint-disable no-param-reassign */
import Ember from "ember";

const { log } = Ember.Logger;

export default {
    name: "offline-support",
    initialize(application) {
        const notify = application.__container__.lookup("service:notify");

        if ("serviceWorker" in window.navigator) {
            window.navigator.serviceWorker.register("/offline_support.js").then((registration) => {
                const isUpdate = !!registration.active;

                registration.onupdatefound = function () {
                    log("A new Service Worker version has been found...");

                    registration.installing.onstatechange = function () {
                        if (this.state === "installed") {
                            log("Service Worker Installed.");

                            if (isUpdate) {
                                notify.info("App updated. Restart for the new version.");
                            } else {
                                notify.success("App ready for offline use.");
                            }
                        } else {
                            log("New Service Worker state: ", this.state);
                        }
                    };
                };
            }).catch((err) => {
                log(err);
            });
        }
    },
};
