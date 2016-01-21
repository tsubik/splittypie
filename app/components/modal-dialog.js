import Ember from "ember";

export default Ember.Component.extend({
    modal: Ember.inject.service(),

    didInsertElement() {
        this._super(...arguments);
        this.$(".modal").modal().on("hidden.bs.modal", () => {
            this.get("modal").trigger("remove");
        });
        this.get("modal").on("hide", this, "hide");
    },

    hide() {
        this.$(".modal").modal("hide");
    }
});
