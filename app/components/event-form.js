import { oneWay, alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import BaseForm from "splittypie/components/base-form";

export default BaseForm.extend({
    store: service(),

    formObject: alias("event"),
    isSubmitted: oneWay("event.isSubmitted"),

    didInsertElement() {
        if (this.formObject.isNew) {
            this.$(".event-name").focus();
        }
    },

    actions: {
        addUser() {
            const event = this.event;

            event.addUser();
        },

        syncOnline() {
            this.onSyncOnline(this.event.model);
        },
    },
});
