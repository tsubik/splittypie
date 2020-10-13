import { computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    classNames: ["list-group-item", "btn", "btn-default", "transaction-list-item"],

    participants: computed("transaction.participants", function () {
        return this.transaction.participants.getEach("name").join(", ");
    }),

    click() {
        const onClick = this.onClick;

        if (typeof onClick === "function") {
            onClick();
        }
    },
});
