import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "ul",

    transfers: Ember.computed("event.paidOwed", function () {
        const paidOwed = this.get("event.paidOwed");

        const owed = paidOwed.filter((po) => po.get("summary") < 0).map(convertToUserAmount);
        const paid = paidOwed.filter((po) => po.get("summary") > 0).map(convertToUserAmount);
        let transfers = [];

        function convertToUserAmount(po) {
            return Ember.Object.create({
                user: po.get("user"),
                amount: Math.abs(po.get("summary"))
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
                amount: possibleTransfer
            }));
        }

        return transfers;
    })
});
