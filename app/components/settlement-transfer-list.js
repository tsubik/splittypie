import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "ul",
    classNames: ["list-unstyled"],

    anyTransfers: Ember.computed.notEmpty("transfers"),

    transfers: Ember.computed("users.@each.balance", function () {
        const users = this.get("users");

        const owed = users.filter((u) => u.get("balance") < 0).map(convertToUserAmount);
        const paid = users.filter((u) => u.get("balance") > 0).map(convertToUserAmount);
        let transfers = [];

        function convertToUserAmount(user) {
            return Ember.Object.create({
                user: user,
                amount: Math.abs(user.get("balance"))
            });
        }

        while (owed.length > 0 && paid.length > 0) {
            let sender = owed.objectAt(0);
            let recipient = paid.objectAt(0);

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
                amount: possibleTransfer.toFixed(2)
            }));
        }

        return transfers;
    })
});
