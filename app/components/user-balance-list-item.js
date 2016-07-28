import Ember from "ember";

const {
    computed: { gte },
    Component,
} = Ember;

export default Component.extend({
    tagName: "tr",
    classNames: ["user-balance-list-item"],

    isPositive: gte("user.balance", 0),
});
