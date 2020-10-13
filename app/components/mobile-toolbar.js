import Component from "@ember/component";

export default Component.extend({
    tagName: "nav",
    classNames: ["navbar", "navbar-default", "navbar-fixed-top", "visible-xs", "toolbar"],

    attributeBindings: ["role"],
    role: "navigation",
});
