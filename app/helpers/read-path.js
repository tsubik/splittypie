import { get } from '@ember/object';
import Helper from '@ember/component/helper';

export function readPath([object, path]) {
    if (object) {
        return get(object, path);
    }

    return null;
}

export default Helper.helper(readPath);
