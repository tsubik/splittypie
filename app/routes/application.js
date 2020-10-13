import $ from "jquery";
import { inject as service } from "@ember/service";
import { schedule } from "@ember/runloop";
import RSVP from "rsvp";
import Route from "@ember/routing/route";
import { setProperties, get } from "@ember/object";

export default Route.extend({
    modal: service(),
    syncer: service(),
    notify: service(),

    init() {
        this._super(...arguments);
        get(this, "modal").on("show", this, "showModal");
        get(this, "modal").on("remove", this, "removeModal");
        get(this, "syncer").on("conflict", this, "synchronizationConflict");
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
        // Not sure why tests are failing removing outlet, below guards prevents tests from failing
        // TODO: FIXME: try to figure out this one day, it's related to adding quick add feature
        /* if (!this.connections) return; */
        /* if (!this.router.currentHandlerInfos) return; */
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
