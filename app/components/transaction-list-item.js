import Ember from "ember";

export default Ember.Component.extend({
    classNames: ["list-group-item", "btn", "btn-default", "transaction-list-item"],
    modal: Ember.inject.service(),

    participants: Ember.computed("transaction.participants", function () {
        return this.get("transaction.participants").getEach("name").join(", ");
    }),

    click() {
        const onClick = this.get("onClick");

        if (typeof onClick === "function") {
            onClick();
        }
    },
});
