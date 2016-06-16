import Ember from "ember";

export default Ember.Mixin.create({
    scrollSelector: window,

    activate() {
        this._super(...arguments);
        const lastScroll = this.get("lastScroll");

        if (lastScroll) {
            Ember.run.next(() => {
                Ember.$(this.scrollSelector).scrollTop(lastScroll);
            });
        } else {
            Ember.$(this.scrollSelector).scrollTop(0);
        }
    },

    deactivate() {
        this._super(...arguments);
        this.set("lastScroll", Ember.$(this.scrollSelector).scrollTop());
    },
});
