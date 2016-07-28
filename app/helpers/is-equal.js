import Ember from "ember";

const { Helper } = Ember;

export function isEqual([leftSide, rightSide]) {
    return leftSide === rightSide;
}

export default Helper.helper(isEqual);
