import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    modal: service(),
    syncer: service(),
    notify: service(),

    init() {
        this._super(...arguments);
        this.get("modal").on("show", this, "showModal");
        this.get("modal").on("remove", this, "removeModal");
        this.get("syncer").on("conflict", this, "synchronizationConflict");
    },

    model() {
        return Ember.RSVP.hash({
            currencies: this.store.findAll("currency"),
            previousEvents: this.store.findAll("event"),
        });
    },

    setupController() {
        this._super(...arguments);
        this.removePreloader();
    },

    showModal(options) {
        const model = this.modelFor("application");

        Object.assign(model, options);

        this.render(`modals/${options.name}`, {
            into: "application",
            outlet: "modal",
            model,
        });
    },

    removeModal() {
        this.disconnectOutlet({
            outlet: "modal",
            parentView: "application",
        });
    },

    synchronizationConflict(conflict) {
        if (conflict.type === "not-found-online" && conflict.modelName === "event") {
            const message = `
Looks like event ${conflict.model.name} was removed from the online storage.
We are marking it as "Offline", you could synchronize it back to online store
in event's details view.
`;
            this.get("notify").error(message, { closeAfter: null });
        }
    },

    removePreloader() {
        Ember.run.schedule("afterRender", this, function () {
            Ember.$("#preloader").remove();
        });
    },

    actions: {
        invokeAction(action) {
            action();
        },

        removeModal() {
            this.removeModal();
        },
    },
});
