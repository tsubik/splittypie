import Ember from "ember";

export const exist = function (selector) {
    return !!find(selector).length;
};

export default Ember.Test.registerHelper("exist", function (app, selector) {
    return exist(selector);
});
