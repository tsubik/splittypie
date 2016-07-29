import Ember from "ember";
import BaseForm from "splittypie/components/base-form";

const {
    computed: { alias, oneWay },
    inject: { service },
    get,
} = Ember;

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
