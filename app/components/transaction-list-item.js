import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["well"],

    participants: Ember.computed("transaction.participants", function () {
        return this.get("transaction.participants").reduce((prev, item) => {
            if (prev) {
                return prev + ", " + item.get("name");
            }
            return item.get("name");
        });
    }),

    actions: {
        delete(transaction) {
            this.sendAction("delete", transaction);
        }
    }
});
