import { set, get } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    // possible passed-in values with their defaults:
    content: null,
    optionValuePath: "id",
    optionLabelPath: "title",
    action() {}, // action to fire on change

    init() {
        this._super(...arguments);
        if (!this.content) {
            set(this, "content", []);
        }
    },

    actions: {
        change() {
            const inputs = this.$("input");
            const content = this.content;

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
