import $ from "jquery";
import { next } from "@ember/runloop";
import { set, get } from "@ember/object";
import Mixin from "@ember/object/mixin";

export default Mixin.create({
    scrollSelector: window,

    activate() {
        this._super(...arguments);
        const lastScroll = get(this, "lastScroll");

        if (lastScroll) {
            next(() => {
                $(this.scrollSelector).scrollTop(lastScroll);
            });
        } else {
            $(this.scrollSelector).scrollTop(0);
        }
    },

    deactivate() {
        this._super(...arguments);
        set(this, "lastScroll", $(this.scrollSelector).scrollTop());
    },
});
