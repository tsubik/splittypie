import Ember from "ember";

export default Ember.Component.extend({
    // possible passed-in values with their defaults:
    content: null,
    optionValuePath: "id",
    optionLabelPath: "title",
    action: Ember.K, // action to fire on change

    init() {
        this._super(...arguments);
        if (!this.get("content")) {
            this.set("content", []);
        }
    },

    actions: {
        change() {
            const inputs = this.$("input");
            const content = this.get("content");

            let selection = [];

            inputs.each((index, input) => {
                if (input.checked) {
                    selection.pushObject(content.objectAt(index));
                }
            });

            const changeCallback = this.get("action");
            changeCallback(selection);
        }
    }
});
