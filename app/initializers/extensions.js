/* eslint "no-extend-native": 0 */
import { isArray } from "@ember/array";

export function initialize(application) {
    window.App = application;

    Array.prototype.flatten = function () {
        const result = [];

        this.forEach((element) => {
            const array = isArray(element) ? element.flatten() : [element];
            result.push(...array);
        });

        return result;
    };
}

export default {
    name: "extensions",
    initialize,
};
