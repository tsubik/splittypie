import Ember from "ember";

const { Mixin } = Ember;

export default Mixin.create({
    activate() {
        this._super(...arguments);
        window.scrollTo(0, 0);
    },
});
