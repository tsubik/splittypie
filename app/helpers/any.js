import { set, get, observer } from "@ember/object";
import { isArray } from "@ember/array";
import Helper from "@ember/component/helper";

export default Helper.extend({
    compute([array]) {
        set(this, "array", array);

        return isArray(array) && get(array, "length") > 0;
    },

    arrayContentDidChange: observer("array.[]", function () {
        this.recompute();
    }),
});
