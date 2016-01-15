import Ember from "ember";

export function initialize(/* application */) {
    Array.prototype.flatten = function () {
        const result = [];

        this.forEach((element) => {
            result.push.apply(result, Ember.isArray(element)  ? element.flatten() : [element]);
        });

        return result;
    };
}

export default {
    name: "extensions",
    initialize
};
