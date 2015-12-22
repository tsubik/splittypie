import Ember from "ember";

export default Ember.Helper.helper(function ([item, array]) {
    return Ember.makeArray(array).contains(item);
});
