import Ember from "ember";

const { Helper } = Ember;

export function isNot([value]) {
    return !value;
}

export default Helper.helper(isNot);
