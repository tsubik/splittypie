import Ember from "ember";

export default Ember.Component.extend({
    tagName: "tr",
    classNames: ["user-balance-list-item"],
    // classNameBindings: ["isPositive:success:danger"],

    isPositive: Ember.computed.gte("user.balance", 0),
});
