/* jshint node:true */

const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const RSVP = require("rsvp");
const codeVersion = require("../../utils/code-version");

module.exports = {
    name: "upload-rollbar-source-maps",

    isDevelopingAddon() {
        return true;
    },

    outputReady(results) {
        const env = this.app.env;

        if (!(env === "production" || env === "staging")) {
            return true;
        }

        const assetsDir = path.join(results.directory, "assets");
        const files = fs.readdirSync(assetsDir);
        const accessToken = process.env.ROLLBAR_SERVER_ACCESS_TOKEN || "";

        const jsFiles = files.filter(f => /(splittypie|vendor).*\.js/.test(f));
        const mapFiles = files.filter(
            f => /(splittypie|vendor).*\.map/.test(f) && !f.endsWith("css.map")
        );
        const siteUrl = process.env.DEPLOY_SITE_URL || "";
        const prependUrl = `${siteUrl}/assets/`;
        const uploadPromises = [];
        const version = codeVersion();

        jsFiles.forEach((file, index) => {
            const formData = new FormData();
            const map = mapFiles[index];
            const mapFile = path.join(assetsDir, map);
            const mapSize = fs.statSync(mapFile).size;

            formData.append("access_token", accessToken);
            formData.append("version", version);
            formData.append("minified_url", prependUrl + file);
            formData.append("source_map", fs.createReadStream(mapFile), { knownLength: mapSize });

            const uploadPromise = new RSVP.Promise((resolve, reject) => {
                console.log(`uploading ${map} source map to rollbar`);

                formData.submit("https://api.rollbar.com/api/1/sourcemap", (error, result) => {
                    if (error) {
                        reject(error);
                    }

                    result.resume();
                    result.on("end", () => {
                        if (result.statusCode === 200) {
                            resolve();
                        } else {
                            reject(`${result.statusCode} ${result.statusMessage}`);
                        }
                    });
                });
            });

            uploadPromises.push(uploadPromise);
        });

        return RSVP.all(uploadPromises)
            .then(() => console.log("source maps have been successfully uploaded"));
    },
};
