import Ember from "ember";
import leftPad from "splittypie/utils/left-pad";

const { get, computed, Component } = Ember;

export default Component.extend({
    classNames: ["calendar-page"],

    day: computed("date", function () {
        const date = get(this, "date");

        return leftPad("00", new Date(date).getUTCDate().toString());
    }),

    month: computed("date", function () {
        const date = get(this, "date");
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        return months[new Date(date).getMonth()];
    }),
});
