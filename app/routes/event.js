import { inject as service } from "@ember/service";
import {
  setProperties,
  set,
  getProperties
} from "@ember/object";
import Route from "@ember/routing/route";
import isMobile from "splittypie/utils/is-mobile";

export default Route.extend({
    connection: service(),
    eventRepository: service(),
    localStorage: service(),
    modal: service(),
    notify: service(),
    syncer: service(),
    transactionRepository: service(),
    userContext: service(),

    init() {
        this._super(...arguments);
        const syncer = this.syncer;
        if (syncer.get("isSyncing")) {
            this._onSyncStarted();
        }
        syncer.on("syncStarted", this._onSyncStarted.bind(this));
        syncer.on("syncCompleted", this._onSyncCompleted.bind(this));
    },

    model(params) {
        return this.eventRepository.find(params.event_id);
    },

    afterModel(model) {
        const storage = this.localStorage;
        storage.setItem("lastEventId", model.id);
    },

    redirect(model) {
        if (model.constructor.modelName !== "event") return;

        const currentUser = this.userContext.load(model);

        if (!currentUser) {
            this.transitionTo("event.who-are-you");
        }
    },

    setupController(controller) {
        this._super(...arguments);
        const events = this.modelFor("application").previousEvents;

        setProperties(controller, {
            events,
            isMobile: isMobile(),
        });
    },

    actions: {
        share() {
            const event = this.modelFor("event");

            this.modal.trigger("show", {
                name: "share",
                event,
            });
        },

        saveChanges() {
            const event = this.modelFor("event");

            event.save();
        },

        switchUser(user) {
            const event = this.modelFor("event");

            this.userContext.change(event, user);
            this.notify.success(`Now you are watching this event as ${user.get("name")}`);
        },

        showQuickAdd() {
            this.modal.trigger("show", {
                name: "quickAdd"
            });
        },

        quickAdd(transactionProps) {
            const event = this.modelFor("event");
            const repository = this.transactionRepository;
            const store = this.store;

            const transaction = store.createRecord("transaction", {
                ...transactionProps
            });

            repository
                .save(event, transaction)
                .then(() => {
                    this.notify.success("Transaction has been saved.");
                });
        },

        quickAddWithDetails(transactionProps) {
            this.transitionTo("event.transactions.new", {
                queryParams: getProperties(transactionProps, "amount", "date", "name")
            });
        },

        error(error, transition) {
            const eventId = transition.params.event.event_id;
            const storage = this.localStorage;
            const lastEventId = storage.getItem("lastEventId");

            // FIXME: Do this better
            if (error && error.message &&
                error.message.indexOf("no record was found") > -1
                && eventId === lastEventId) {
                storage.removeItem("lastEventId");
                this.transitionTo("index");
            } else {
                return true;
            }

            return false;
        },
    },

    _onSyncStarted() {
        const syncProgressIndicator = new window.Mprogress({ template: 3 });
        syncProgressIndicator.start();
        set(this, "syncProgressIndicator", syncProgressIndicator);
    },

    _onSyncCompleted() {
        const syncProgressIndicator = this.syncProgressIndicator;
        if (syncProgressIndicator) {
            syncProgressIndicator.end();
        }
    },
});
