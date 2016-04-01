import Ember from "ember";

export default Ember.Component.extend({
    classNames: ["add-transaction-button"],

    anyTransactions: Ember.computed.notEmpty("event.transactions"),
});
