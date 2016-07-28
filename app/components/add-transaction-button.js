import Ember from "ember";

const {
    computed: { notEmpty },
    Component,
} = Ember;

export default Component.extend({
    classNames: ["add-transaction-button"],

    anyTransactions: notEmpty("event.transactions"),
});
