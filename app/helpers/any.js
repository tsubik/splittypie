import Ember from "ember";

const {
    observer,
    get,
    set,
    isArray,
    Helper,
} = Ember;

export default Helper.extend({
    compute([array]) {
        set(this, "array", array);

        return isArray(array) && get(array, "length") > 0;
    },

    arrayContentDidChange: observer("array.[]", function () {
        this.recompute();
    }),
});
