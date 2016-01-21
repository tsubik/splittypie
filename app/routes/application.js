import Ember from "ember";

export default Ember.Route.extend({
    modal: Ember.inject.service(),

    init() {
        this._super(...arguments);
        this.get("modal").on("show", this, "showModal");
        this.get("modal").on("remove", this, "removeModal");
    },

    model() {
        return Ember.RSVP.hash({
            currencies: this.store.findAll("currency")
        });
    },

    showModal: function(options) {
        options.actions = options.actions || {};

        this.render(`modals/${options.name}`, {
            into: "application",
            outlet: "modal",
            model: options
        });
    },

    removeModal: function() {
        this.disconnectOutlet({
            outlet: "modal",
            parentView: "application"
        });
    },

    actions: {
        invokeAction(action) {
            action();
        },

        removeModal() {
            this.removeModal();
        }
    }
});
