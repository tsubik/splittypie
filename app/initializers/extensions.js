/* eslint "no-extend-native": 0 */
import Ember from "ember";

const { isArray } = Ember;

export function initialize(application) {
    window.App = application;

    Array.prototype.flatten = function () {
        const result = [];

        this.forEach((element) => {
            result.push.apply(result, isArray(element) ? element.flatten() : [element]);
        });

        return result;
    };
}

export default {
    name: "extensions",
    initialize,
};
