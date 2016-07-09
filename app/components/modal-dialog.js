import Ember from "ember";

export default Ember.Component.extend({
    modal: Ember.inject.service(),

    didInsertElement() {
        this._super(...arguments);
        this.$(".modal").modal().on("hidden.bs.modal", () => {
            Ember.run(() => {
                this.get("modal").trigger("remove");
            });
        });
        this.get("modal").one("hide", this, "onHide");
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
