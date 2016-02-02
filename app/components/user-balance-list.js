import Ember from "ember";

export default Ember.Component.extend({
    anyUsers: Ember.computed.notEmpty("users"),

    usersSorting: ["balance:desc"],
    sortedUsers: Ember.computed.sort("users", "usersSorting"),
});
