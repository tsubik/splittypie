import { notEmpty } from "@ember/object/computed";
import EmberObject, { computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    tagName: "ul",
    classNames: ["list-unstyled"],

    anyTransfers: notEmpty("transfers"),

    transfers: computed("users.@each.balance", function () {
        const users = this.users;
        const currency = this.users.firstObject.event.currency;

        const owed = users.filter(u => u.balance < 0).map(convertToUserAmount);
        const paid = users.filter(u => u.balance > 0).map(convertToUserAmount);
        const transfers = [];

        function convertToUserAmount(user) {
            return EmberObject.create({
                user,
                amount: Math.abs(user.balance),
            });
        }

        while (owed.length > 0 && paid.length > 0) {
            const sender = owed.objectAt(0);
            const recipient = paid.objectAt(0);

            const canGive = sender.get("amount");
            const demand = recipient.get("amount");
            const possibleTransfer = Math.min(canGive, demand);

            sender.set("amount", canGive - possibleTransfer);
            if (sender.amount === 0) {
                owed.removeObject(sender);
            }

            recipient.set("amount", demand - possibleTransfer);
            if (recipient.amount === 0) {
                paid.removeObject(recipient);
            }

            transfers.pushObject(EmberObject.create({
                sender: sender.user,
                recipient: recipient.user,
                amount: possibleTransfer.toFixed(2),
                currency,
            }));
        }

        return transfers;
    })
});
