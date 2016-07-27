import Ember from "ember";

export default Ember.Helper.extend({
    compute([array]) {
        this.set("array", array);

        return Ember.isArray(array) && array.get("length") > 0;
    },

    arrayContentDidChange: Ember.observer("array.[]", function () {
        this.recompute();
    }),
});
