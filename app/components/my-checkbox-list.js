import Ember from "ember";

const {
    get,
    set,
    K,
    Component,
} = Ember;

export default Component.extend({
    // possible passed-in values with their defaults:
    content: null,
    optionValuePath: "id",
    optionLabelPath: "title",
    action: K, // action to fire on change

    init() {
        this._super(...arguments);
        if (!get(this, "content")) {
            set(this, "content", []);
        }
    },

    actions: {
        change() {
            const inputs = this.$("input");
            const content = get(this, "content");

            const selection = [];

            inputs.each((index, input) => {
                if (input.checked) {
                    selection.pushObject(content.objectAt(index));
                }
            });

            set(this, "selection", selection);
        },
    },
});
