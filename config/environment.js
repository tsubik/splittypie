/* jshint node: true */

const codeVersion = require("../utils/code-version");

module.exports = function (environment) {
    const ENV = {
        modulePrefix: "splittypie",
        environment,
        contentSecurityPolicy: {
            "connect-src": "'self' https://auth.firebase.com wss://*.firebaseio.com",
            "script-src": "'self' 'unsafe-inline' https://*.firebaseio.com https://www.google-analytics.com",
            "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src": "'self' data: https://fonts.gstatic.com",
            "img-src": "'self' data:",
        },
        "ember-index": {
            output: "200.html",
            content: [{
                key: "index-preload",
                file: "index-preload.html",
                includeInIndexHtml: true,
                includeInOutput: false,
            }, {
                key: "app-preload",
                file: "app-preload.html",
                includeInIndexHtml: false,
                includeInOutput: true,
            }],
        },
        firebase: process.env.FIREBASE_URL,
        rollbar: {
            accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
            enabled: environment === "production" || environment === "staging",
            captureUncaught: true,
            payload: {
                environment,
                client: {
                    javascript: {
                        source_map_enabled: true,
                        code_version: codeVersion(),
                        guess_uncaught_frames: true,
                    },
                },
            },
        },
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
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
    }

    return ENV;
};
