import Ember from 'ember';

export default Ember.Component.extend({
    updatePayer(transaction, payer) {
        transaction.set("payer", payer);
    },

    updateParticipants(transaction, participants) {
        transaction.set("participants", participants);
    }
});
