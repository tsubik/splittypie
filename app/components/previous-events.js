import { notEmpty } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    localStorage: service(),
    modal: service(),

    classNames: ["previous-events-container"],
    attributeBindings: ["id"],
    tagName: "section",
    id: "events",

    anyEvents: notEmpty("events"),

    actions: {
        remove(event) {
            const storage = this.localStorage;
            const showModal = storage.getItem("remove-prev-events-got-it") !== "true";

            if (showModal) {
                const yes = () => {
                    this._removeEventFromOfflineStore(event);
                    this.modal.trigger("hide");
                };

                this.modal.trigger("show", {
                    name: "remove-previous-event",
                    actions: {
                        yes,
                        yes_remember: () => {
                            storage.setItem("remove-prev-events-got-it", "true");
                            yes();
                        },
                    },
                    event,
                });
            } else {
                this._removeEventFromOfflineStore(event);
            }
        },
    },

    _removeEventFromOfflineStore(event) {
        const storage = this.localStorage;
        const lastEventId = storage.getItem("lastEventId");

        // remove only from offline store
        event.destroyRecord();

        if (lastEventId === event.id) {
            storage.removeItem("lastEventId");
        }
    },
});
