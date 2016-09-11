import Ember from "ember";

const { Helper } = Ember;

export function isIncluded([item, array]) {
    if (!array) {
        return false;
    }

    return array.includes(item);
}

export default Helper.helper(isIncluded);
