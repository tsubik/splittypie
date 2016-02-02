import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["list-group"],

    anyTransactions: Ember.computed.notEmpty("transactions"),

    actions: {
        edit(transaction) {
            this.sendAction("edit", transaction);
        },
    },
});
