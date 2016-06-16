import Ember from "ember";
import RemeberScrollMixin from "splittypie/mixins/remember-scroll";

export function initialize() {
    Ember.Route.reopen(RemeberScrollMixin);
}

export default {
    name: "remember-scroll",
    initialize,
};
