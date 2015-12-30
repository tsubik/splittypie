import Ember from "ember";

export function isNot([value]) {
    return !value;
}

export default Ember.Helper.helper(isNot);
