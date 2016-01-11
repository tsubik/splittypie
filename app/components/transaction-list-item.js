import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["well"],

    participants: Ember.computed("transaction.participants", function () {
        return this.get("transaction.participants").getEach("name").join(", ");
    }),

    actions: {
        delete(transaction) {
            this.sendAction("delete", transaction);
        }
    }
});
