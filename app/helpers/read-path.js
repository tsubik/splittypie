import Ember from "ember";

export function readPath([object, path]) {
    if (object) {
        return Ember.get(object, path);
    }

    return null;
}

export default Ember.Helper.helper(readPath);
