import Ember from "ember";

export function isIncluded([item, array]) {
    if(!array) {
        return false;
    }

    return array.contains(item);
}

export default Ember.Helper.helper(isIncluded);
