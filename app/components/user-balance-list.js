import { sort, notEmpty } from "@ember/object/computed";
import Component from "@ember/component";

export default Component.extend({
    anyUsers: notEmpty("users"),

    usersSorting: ["balance:desc"], // eslint-disable-line
    sortedUsers: sort("users", "usersSorting"),
});
