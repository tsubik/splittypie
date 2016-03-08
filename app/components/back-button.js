import Ember from "ember";

export default Ember.Component.extend({
    tagName: "button",
    classNames: ["btn", "btn-link", "navbar-btn"],

    click() {
        window.history.back();
    },
});
