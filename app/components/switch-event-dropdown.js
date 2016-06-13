import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["dropdown", "event-dropdown"],

    otherEvents: Ember.computed("events", "selected", function () {
        const events = this.get("events");
        const selected = this.get("selected");

        return events.rejectBy("id", selected.get("id"));
    }),

    anyOtherEvents: Ember.computed.notEmpty("otherEvents"),
});
