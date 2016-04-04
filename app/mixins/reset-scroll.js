import Ember from "ember";

export default Ember.Mixin.create({
    activate() {
        this._super(...arguments);
        window.scrollTo(0, 0);
    },
});
