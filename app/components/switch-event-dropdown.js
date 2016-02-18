import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["dropdown"],

    anyOtherEvents: Ember.computed.notEmpty("otherEvents"),
});
