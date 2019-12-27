import Helper from "@ember/component/helper";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { get, computed } from "@ember/object";

export default Helper.extend({
    router: computed(function () {
        return getOwner(this).lookup("router:main");
    }).readOnly(),
    compute([routeName, ...params]) {
        const router = get(this, "router");

        assert("[ember-transition-helper] Unable to lookup router", router);

        return function (...invocationArgs) {
            const args = params.concat(invocationArgs);
            const transitionArgs = params.length ? [routeName, ...params] : [routeName];

            router.transitionTo(...transitionArgs);

            return args;
        };
    },
});
