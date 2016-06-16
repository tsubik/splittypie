import Ember from "ember";

export function any(params) {
    const array = params[0];

    return Ember.isArray(array) && array.length > 0;
}

export default Ember.Helper.helper(any);
