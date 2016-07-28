import Ember from "ember";
import FormComponent from "splittypie/mixins/form-component";

const {
    computed: { alias, oneWay },
    inject: { service },
    get,
    Component,
} = Ember;

export default Component.extend(FormComponent, {
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
