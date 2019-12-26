/* eslint-env node */

module.exports = function (env) {
    return {
        clientAllowedKeys: [],
        fastbootAllowedKeys: [],
        failOnMissingKey: false,
        path: `.env.${env}`
    };
};
