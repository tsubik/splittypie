import Ember from "ember";

export default Ember.Test.registerHelper("exist", function(app, selector) {
    return !!find(selector).length;
});
