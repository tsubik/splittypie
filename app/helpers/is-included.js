import Helper from '@ember/component/helper';

export function isIncluded([item, array]) {
    if (!array) {
        return false;
    }

    return array.includes(item);
}

export default Helper.helper(isIncluded);
