import { on } from '@ember/object/evented';
import { observer, set, get } from '@ember/object';
import Component from '@ember/component';
import Ember from "ember";

const {
    K
} = Ember;

export default Component.extend({
    // possible passed-in values with their defaults:
    options: null,
    prompt: null,
    optionValuePath: "id",
    optionLabelPath: "title",
    action: K, // action to fire on change

    init() {
        this._super(...arguments);
        if (!get(this, "options")) {
            set(this, "options", []);
        }
    },

    valueDidChanged: on("init", observer("value", function () {
        const options = get(this, "options");
        const value = get(this, "value");

        if (value) {
            const key = get(this, "optionValuePath");
            const selected = options.findBy(key, value);

            set(this, "selected", selected);
        }
    })),

    actions: {
        change() {
            const selectEl = this.$("select")[0];
            const selectedIndex = selectEl.selectedIndex;
            const options = get(this, "options");

            // decrement index by 1 if we have a prompt
            const hasPrompt = !!get(this, "prompt");
            const contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

            const selected = options.objectAt(contentIndex);

            set(this, "selected", selected);
            if (selected) {
                set(this, "value", get(selected, get(this, "optionValuePath")));
            } else {
                set(this, "value", null);
            }
        },
    },
});
