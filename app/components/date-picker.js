import Ember from "ember";
import isMobile from "splittypie/utils/is-mobile";

export default Ember.Component.extend({
    value: null,
    min: null,
    max: null,

    isMobile: isMobile.property(),

    pikadayMin: Ember.computed("min", function () {
        return new Date(this.get("min"));
    }),
    pikadayMax: Ember.computed("max", function () {
        return new Date(this.get("max"));
    }),
    pikadayValue: Ember.computed("value", function () {
        const value = this.get("value");

        return new Date(value);
    }),
    pikadayValueDidChange: Ember.observer("pikadayValue", function () {
        const pikadayValue = this.get("pikadayValue");

        if (pikadayValue) {
            this.set("value", pikadayValue.toISOString().substring(0, 10));
        } else {
            this.set("value", null);
        }
    }),

    dateInputClasses: Ember.on("init", Ember.computed("className", function () {
        const className = this.get("className");

        return `${className} form-control`;
    })),
});
