import Ember from "ember";

export default Ember.Component.extend({
    tagName: "nav",
    classNames: ["navbar", "navbar-default", "navbar-fixed-top", "visible-xs", "toolbar"],

    attributeBindings: ["role"],
    role: "navigation",
});
