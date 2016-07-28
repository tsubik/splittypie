import Ember from "ember";

const {
    run: { later },
    TextField,
} = Ember;

export default TextField.extend({
    readonly: true,

    classNames: ["event-url"],

    didInsertElement() {
        this._super(...arguments);

        // workaround select after animations
        later(() => {
            this.$().focus().select();
        }, 500);
    },
});
