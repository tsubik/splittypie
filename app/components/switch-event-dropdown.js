import Ember from "ember";

const {
    computed: { notEmpty },
    computed,
    get,
    Component,
} = Ember;

export default Component.extend({
    tagName: "div",
    classNames: ["dropdown", "event-dropdown"],

    otherEvents: computed("events", "selected", function () {
        const events = get(this, "events");
        const selected = get(this, "selected");

        return events.rejectBy("id", selected.get("id"));
    }),

    anyOtherEvents: notEmpty("otherEvents"),
});
