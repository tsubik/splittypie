import { oneWay, alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import BaseForm from "splittypie/components/base-form";

export default BaseForm.extend({
    store: service(),

    formObject: alias("event"),
    isSubmitted: oneWay("event.isSubmitted"),

    didInsertElement() {
        if (get(this, "formObject.isNew")) {
            this.$(".event-name").focus();
        }
    },

    actions: {
        addUser() {
            const event = get(this, "event");

            event.addUser();
        },

        syncOnline() {
            this.sendAction("syncOnline", get(this, "event.model"));
        },
    },
});
