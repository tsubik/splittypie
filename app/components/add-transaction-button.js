import { notEmpty } from "@ember/object/computed";
import Component from "@ember/component";

export default Component.extend({
    classNames: ["add-transaction-button"],

    anyTransactions: notEmpty("event.transactions")
});
