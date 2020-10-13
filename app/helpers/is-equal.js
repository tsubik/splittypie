import Helper from "@ember/component/helper";

export function isEqual([leftSide, rightSide]) {
    return leftSide === rightSide;
}

export default Helper.helper(isEqual);
