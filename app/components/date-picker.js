import Ember from "ember";
import isMobile from "splittypie/utils/is-mobile";

const {
    computed,
    observer,
    on,
    get,
    set,
    Component,
} = Ember;

export default Component.extend({
    value: null,
    min: null,
    max: null,

    isMobile: isMobile.property(),

    pikadayMin: computed("min", function () {
        return new Date(get(this, "min"));
    }),
    pikadayMax: computed("max", function () {
        return new Date(get(this, "max"));
    }),
    pikadayValue: computed("value", function () {
        const value = get(this, "value");

        return new Date(value);
    }),
    pikadayValueDidChange: observer("pikadayValue", function () {
        const pikadayValue = get(this, "pikadayValue");

        if (pikadayValue) {
            set(this, "value", pikadayValue.toISOString().substring(0, 10));
        } else {
            set(this, "value", null);
        }
    }),

    dateInputClasses: on("init", computed("className", function () {
        const className = get(this, "className");

        return `${className} form-control`;
    })),
});
