import Ember from "ember";

export default Ember.TextField.extend({
    classNames: ["event-url"],
    readonly: true,

    didInsertElement() {
        this._super(...arguments);

        // workaround select after animations
        Ember.run.later(() => {
            this.$().focus().select();
        }, 500);
    },
});
