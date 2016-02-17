import Ember from "ember";

export default Ember.Service.extend({
    isOpen: false,

    stateChanged: Ember.observer("isOpen", function () {
        const isShown = this.get("isOpen");
        const $sideMenu = Ember.$(".side-menu");

        if (isShown) {
            const $backdrop = Ember.$(`<div class="modal-backdrop fade in"></div>`);

            $sideMenu.after($backdrop);
            $sideMenu.one("click", "a", this.hide.bind(this));
            $backdrop.one("click", this.hide.bind(this));
        } else {
            const $backdrop = Ember.$(".modal-backdrop");

            $backdrop.fadeOut(() => {
                $backdrop.remove();
            });
        }
    }),

    hide() {
        this.set("isOpen", false);
    },

    show() {
        this.set("isOpen", true);
    },
});
