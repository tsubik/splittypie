import Ember from "ember";

const {
    $,
    inject: { service },
    run: { schedule },
    RSVP,
    Route,
    get,
    setProperties,
} = Ember;

export default Route.extend({
    modal: service(),
    syncer: service(),
    notify: service(),

    init() {
        this._super(...arguments);
        get(this, "modal").on("show", this, "showModal");
        get(this, "modal").on("remove", this, "removeModal");
        get(this, "syncer").on("conflict", this, "synchronizationConflict");
        get(this, "syncer").on("syncCompleted", this, "synchronizationCompleted");
    },

    model() {
        return RSVP.hash({
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

        setProperties(model, options);

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
            get(this, "notify").error(message, { closeAfter: null });
        }
    },

    synchronizationCompleted() {
        get(this, "notify").info("Synchronization with online database has been completed.");
    },

    removePreloader() {
        schedule("afterRender", this, function () {
            $("#preloader").remove();
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
