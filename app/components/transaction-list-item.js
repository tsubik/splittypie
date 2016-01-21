import Ember from "ember";

export default Ember.Component.extend({
    tagName: "div",
    classNames: ["well", "transaction-list-item"],
    modal: Ember.inject.service(),

    participants: Ember.computed("transaction.participants", function () {
        return this.get("transaction.participants").getEach("name").join(", ");
    }),

    actions: {
        delete(transaction) {
            this.get("modal").trigger("show", {
                name: "confirm",
                actions: {
                    ok: () => {
                        this.sendAction("delete", transaction);
                        this.get("modal").trigger("hide");
                    }
                }
            });
        }
    }
});
