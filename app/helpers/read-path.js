import Ember from "ember";

const {
    get,
    Helper,
} = Ember;

export function readPath([object, path]) {
    if (object) {
        return get(object, path);
    }

    return null;
}

export default Helper.helper(readPath);
