import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import { run } from "@ember/runloop";
import Component from "@ember/component";

export default Component.extend({
    modal: service(),

    didInsertElement() {
        this._super(...arguments);
        this.$(".modal").modal().on("hidden.bs.modal", () => {
            run(() => {
                this.modal.trigger("remove");
            });
        });
        this.modal.one("hide", this, "onHide");
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
