import { gte } from "@ember/object/computed";
import Component from "@ember/component";

export default Component.extend({
    tagName: "tr",
    classNames: ["user-balance-list-item"],

    isPositive: gte("user.balance", 0),
});
