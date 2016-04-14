const exec = require("child_process").execSync;

module.exports = function () {
    return exec("git rev-parse HEAD").toString().trim();
};
