/* eslint-disable no-param-reassign, max-len */

export default {
    name: "offline-support",
    initialize(applicationInstance) {
        console.debug("initialize offline support");

        // TODO: renable this
        const notify = applicationInstance.lookup("service:notify");
        /* if ("serviceWorker" in window.navigator) {
         *     window.navigator.serviceWorker.register("/offline-support.js").then((registration) => {
         *         const isUpdate = !!registration.active;
         *         console.debug("Offline Support Registered", registration);

         *         registration.onupdatefound = function () {
         *             console.debug("A new Service Worker version has been found...");

         *             registration.installing.onstatechange = function () {
         *                 if (this.state === "installed") {
         *                     console.debug("Service Worker Installed.");

         *                     if (isUpdate) {
         *                         notify.info(
         *                             "Application has been updated. Please reload page for the new version.",
         *                             { closeAfter: null }
         *                         );
         *                     } else {
         *                         notify.success("App ready for offline use.");
         *                     }
         *                 } else {
         *                     console.debug("New Service Worker state: ", this.state);
         *                 }
         *             };
         *         };
         *     }).catch((err) => {
         *         console.error(err);
         *     });
         * } */
    },
};
