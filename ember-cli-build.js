/*eslint-disable */
const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const env = process.env.EMBER_ENV;

require("dotenv").config({
    path: `.env.${env}`
});

const config = require("./config/environment")(env);

module.exports = function (defaults) {
    const app = new EmberApp(defaults, {
        babel: {
            includePolyfill: true,
        },
        fingerprint: {
            enabled: (env === "production" || env === "staging"),
        },
        sassOptions: {
            includePaths: [
                "bower_components/bootstrap-sass/assets/stylesheets",
                "vendor/bootstrap-paper",
            ],
        },
        sourcemaps: {
            enabled: true,
        },
        inlineContent: {
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
    app.import(
        "bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot",
        { destDir: "fonts/bootstrap" }
    );
    app.import(
        "bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.svg",
        { destDir: "fonts/bootstrap" }
    );
    app.import(
        "bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf",
        { destDir: "fonts/bootstrap" }
    );
    app.import(
        "bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff",
        { destDir: "fonts/bootstrap" }
    );
    app.import(
        "bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2",
        { destDir: "fonts/bootstrap" }
    );


    return app.toTree();
};
