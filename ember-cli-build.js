/*eslint-disable */
const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const env = process.env.EMBER_ENV;

require("dotenv").config({
    path: `.env.${env}`
});

const config = require("./config/environment")(env);

module.exports = function (defaults) {
    const app = new EmberApp(defaults, {
        "ember-cli-babel": {
            includePolyfill: true,
        },
        fingerprint: {
            exclude: ["assets/icons/", "offline-support.js", "sw-toolbox.js"],
            enabled: (env === "production" || env === "staging" || env === "offline"),
        },
        sassOptions: {
            includePaths: [
                "bower_components/bootstrap-sass/assets/stylesheets",
                "vendor/bootstrap-paper",
            ],
        },
        minifyJS: {
            options: {
                exclude: ["sw-toolbox.js"]
            }
        },
        sourcemaps: {
            enabled: true,
        },
        svg: {
            paths: [
                "public/assets/icons",
            ]
        },
        inlineContent: {
            "last-event": {
                file: "app/last-event.html",
                enabled: true,
            },
            analytics: {
                file: "app/analytics.html",
                enabled: !!config.GOOGLE_ANALYTICS_ID,
                postProcess: function (content) {
                    return content.replace(/\{\{GOOGLE_ANALYTICS_ID\}\}/g, config.GOOGLE_ANALYTICS_ID);
                },
            },
            rollbar: {
                file: "app/rollbar.html",
                enabled: config.rollbar.enabled,
                postProcess: function (content) {
                    return content.replace(/\{\{rollbarConfig\}\}/g, JSON.stringify(config.rollbar));
                }
            }
        },
    });

    app.import("bower_components/bootstrap-sass/assets/javascripts/bootstrap.js");
    app.import("bower_components/mprogress/build/css/mprogress.css");
    app.import("bower_components/mprogress/build/js/mprogress.js");

    return app.toTree();
};
