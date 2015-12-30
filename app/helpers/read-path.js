import Ember from "ember";

export function readPath([object, path]) {
    return Ember.get(object, path);
}

export default Ember.Helper.helper(readPath);
