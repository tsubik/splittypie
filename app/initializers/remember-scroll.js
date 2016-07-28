import Ember from "ember";
import RemeberScrollMixin from "splittypie/mixins/remember-scroll";

const { Route } = Ember;

export function initialize() {
    Route.reopen(RemeberScrollMixin);
}

export default {
    name: "remember-scroll",
    initialize,
};
