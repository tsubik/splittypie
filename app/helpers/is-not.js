import Helper from '@ember/component/helper';

export function isNot([value]) {
    return !value;
}

export default Helper.helper(isNot);
