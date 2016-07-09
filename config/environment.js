/* jshint node: true */

const codeVersion = require("../utils/code-version");

module.exports = function (environment) {
    const ENV = {
        modulePrefix: "splittypie",
        environment,
        contentSecurityPolicy: {
            "default-src": "'self'",
            "connect-src": "'self' https://geoip.nekudo.com https://auth.firebase.com wss://*.firebaseio.com",
            "script-src": "'self' 'unsafe-inline' https://*.rollbar.com https://*.firebaseio.com https://www.google-analytics.com",
            "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src": "'self' data: https://fonts.gstatic.com",
            "img-src": "'self' data: https://www.google-analytics.com",
        },
        contentSecurityPolicyMeta: true,
        "ember-index": {
            output: "app.html",
            content: [{
                key: "index-preload",
                file: "preloaders/index-preload.html",
                includeInIndexHtml: true,
                includeInOutput: false,
            }, {
                key: "app-preload",
                file: "preloaders/app-preload.html",
                includeInIndexHtml: false,
                includeInOutput: true,
            }],
        },
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY,
            databaseURL: `https://${process.env.FIREBASE_APP_NAME}.firebaseio.com`,
        },
        serviceWorker: {
            enabled: true,
            debug: true,
            serviceWorkerFile: "offline-support.js",
            includeRegistration: false, // registering in app/initializers/offline-support
            precacheURLs: [
                "/app.html",
            ],
            fastestURLs: [
                { route: "/(.*)", method: "get", options: { origin: "https://fonts.gstatic.com" } },
                { route: "/css", method: "get", options: { origin: "https://fonts.googleapis.com" } },
            ],
            fallback: [
                "/(.*) /app.html",
            ],
        },
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
            rollbarJsUrl: "https://cdn.rollbar.com/js/v1.8/rollbar.min.js",
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

        // remove ember-index preloader in test env
        delete ENV["ember-index"];

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = "#ember-testing";
        ENV.APP.testFirebase = ENV.firebase;
    }

    return ENV;
};
