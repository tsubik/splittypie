import Ember from "ember";

export default Ember.Service.extend({
    isOpen: false,

    toggle() {
        this.toggleProperty("isOpen");

        const isShown = this.get("isOpen");
        const $sideMenu = Ember.$(".side-menu");

        if (isShown) {
            const $backdrop = Ember.$(`<div class="modal-backdrop fade in"></div>`);

            $sideMenu.after($backdrop);
            $backdrop.on("click", () => {
                this.toggle();
            });
        } else {
            const $backdrop = Ember.$(".modal-backdrop");

            $backdrop.fadeOut(() => {
                $backdrop.remove();
            });
        }
    },
});
