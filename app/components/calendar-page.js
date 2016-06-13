import Ember from "ember";
import leftPad from "splittypie/utils/left-pad";

const { computed } = Ember;

export default Ember.Component.extend({
    classNames: ["calendar-page"],

    day: computed("date", function () {
        const date = this.get("date");

        return leftPad("00", new Date(date).getDate().toString());
    }),

    month: computed("date", function () {
        const date = this.get("date");
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        return months[new Date(date).getMonth()];
    }),
});
