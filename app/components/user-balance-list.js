import Ember from "ember";

const {
    computed: { notEmpty, sort },
    Component,
} = Ember;

export default Component.extend({
    anyUsers: notEmpty("users"),

    usersSorting: ["balance:desc"],
    sortedUsers: sort("users", "usersSorting"),
});
