import Ember from "ember";

export default Ember.Component.extend({
    tagName: "ul",
    classNames: ["list-unstyled"],

    anyTransfers: Ember.computed.notEmpty("transfers"),

    transfers: Ember.computed("users.@each.balance", function () {
        const users = this.get("users");
        const currency = this.get("users.firstObject.event.currency");

        const owed = users.filter(u => u.get("balance") < 0).map(convertToUserAmount);
        const paid = users.filter(u => u.get("balance") > 0).map(convertToUserAmount);
        const transfers = [];

        function convertToUserAmount(user) {
            return Ember.Object.create({
                user,
                amount: Math.abs(user.get("balance")),
            });
        }

        while (owed.length > 0 && paid.length > 0) {
            const sender = owed.objectAt(0);
            const recipient = paid.objectAt(0);

            const canGive = sender.get("amount");
            const demand = recipient.get("amount");
            const possibleTransfer = Math.min(canGive, demand);

            sender.set("amount", canGive - possibleTransfer);
            if (sender.get("amount") === 0) {
                owed.removeObject(sender);
            }

            recipient.set("amount", demand - possibleTransfer);
            if (recipient.get("amount") === 0) {
                paid.removeObject(recipient);
            }

            transfers.pushObject(Ember.Object.create({
                sender: sender.get("user"),
                recipient: recipient.get("user"),
                amount: possibleTransfer.toFixed(2),
                currency,
            }));
        }

        return transfers;
    }),
});
