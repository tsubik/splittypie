import Ember from "ember";

const {
    inject: { service },
    get,
    run,
    Component,
} = Ember;

export default Component.extend({
    modal: service(),

    didInsertElement() {
        this._super(...arguments);
        this.$(".modal").modal().on("hidden.bs.modal", () => {
            run(() => {
                get(this, "modal").trigger("remove");
            });
        });
        get(this, "modal").one("hide", this, "onHide");
    },

    willDestroyElement() {
        this.onHide();
    },

    onHide() {
        const $modal = this.$(".modal");

        if ($modal && $modal.modal) {
            this.$(".modal").modal("hide");
        }
    },
});
