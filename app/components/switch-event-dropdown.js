import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["dropdown"],

    otherEvents: Ember.computed("events", function () {
        const events = this.get("events");
        const selected = this.get("selected");

        return events.rejectBy("id", selected.id);
    }),

    anyOtherEvents: Ember.computed.notEmpty("otherEvents"),
});
