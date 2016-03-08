import Ember from "ember";

export default Ember.Component.extend({
    sideMenu: Ember.inject.service(),

    tagName: "button",
    classNames: ["navbar-btn", "btn", "btn-link", "pull-left"],

    click() {
        this.get("sideMenu").toggle();
    },
});
