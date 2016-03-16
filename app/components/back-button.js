import Ember from "ember";

export default Ember.Component.extend({
    tagName: "button",
    classNames: ["btn", "btn-link"],

    click() {
        window.history.back();

        return false;
    },
});
