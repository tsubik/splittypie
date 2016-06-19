import Ember from "ember";
import FormComponent from "splittypie/mixins/form-component";

export default Ember.Component.extend(FormComponent, {
    formObject: Ember.computed.alias("event"),
    store: Ember.inject.service(),
    isSubmitted: Ember.computed.oneWay("event.isSubmitted"),

    didInsertElement() {
        this.$(".event-name").focus();
    },

    actions: {
        addUser() {
            const event = this.get("event");

            event.addUser();
        },
    },
});
