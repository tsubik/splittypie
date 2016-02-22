/* jshint node: true */

module.exports = function (environment) {
    const ENV = {
        modulePrefix: "splitr-lite",
        environment,
        contentSecurityPolicy: {
            "connect-src": "'self' https://auth.firebase.com wss://*.firebaseio.com",
            "script-src": "'self' 'unsafe-inline' https://*.firebaseio.com",
            "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src": "'self' data: https://fonts.gstatic.com",
            "img-src": "'self' data:",
        },

        firebase: "https://splitr-lite-dev.firebaseio.com/",
        baseURL: "/",
        locationType: "auto",
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. "with-controller": true
            },
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
    };

    if (environment === "development") {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === "test") {
        // Testem prefers this...
        ENV.baseURL = "/";
        ENV.locationType = "none";

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = "#ember-testing";
        ENV.firebase = "https://splitr-lite-test.firebaseio.com";
    }

    if (environment === "staging") {
        ENV.firebase = "https://splitr-lite-staging.firebase.io.com";
    }

    if (environment === "production") {
        ENV.firebase = "https://splitr-lite.firebase.io.com";
    }

    return ENV;
};
