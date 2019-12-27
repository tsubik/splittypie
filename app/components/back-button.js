import Component from '@ember/component';

export default Component.extend({
    tagName: "button",
    classNames: ["btn", "btn-link"],

    click() {
        window.history.back();

        return false;
    },
});
