import Ember from "ember";

const {
    $,
    run: { next },
    get,
    set,
    Mixin,
} = Ember;

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
