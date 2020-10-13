import { on } from "@ember/object/evented";
import { observer, set, get } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    // possible passed-in values with their defaults:
    options: null,
    prompt: null,
    optionValuePath: "id",
    optionLabelPath: "title",
    action() {}, // action to fire on change

    init() {
        this._super(...arguments);
        if (!this.options) {
            set(this, "options", []);
        }
    },

    // eslint-disable-next-line
    valueDidChanged: on("init", observer("value", function () {
        const options = this.options;
        const value = this.value;

        if (value) {
            const key = this.optionValuePath;
            const selected = options.findBy(key, value);

            set(this, "selected", selected);
        }
    })),

    actions: {
        change() {
            const selectEl = this.$("select")[0];
            const selectedIndex = selectEl.selectedIndex;
            const options = this.options;

            // decrement index by 1 if we have a prompt
            const hasPrompt = !!this.prompt;
            const contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

            const selected = options.objectAt(contentIndex);

            set(this, "selected", selected);
            if (selected) {
                set(this, "value", get(selected, this.optionValuePath));
            } else {
                set(this, "value", null);
            }
        },
    },
});
