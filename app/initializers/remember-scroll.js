import Route from '@ember/routing/route';
import RemeberScrollMixin from "splittypie/mixins/remember-scroll";

export function initialize() {
    Route.reopen(RemeberScrollMixin);
}

export default {
    name: "remember-scroll",
    initialize,
};
