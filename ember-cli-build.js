const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const env = process.env.EMBER_ENV;

module.exports = function (defaults) {
    const app = new EmberApp(defaults, {
        babel: {
            includePolyfill: true,
        },
        "ember-cli-qunit": {
            useLintTree: false,
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
    });

    app.import("bower_components/bootstrap-sass/assets/javascripts/bootstrap.js");
    app.import(
        "bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2",
        { destDir: "fonts/bootstrap" }
    );

    return app.toTree();
};
