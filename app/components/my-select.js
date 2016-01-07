import Ember from "ember";

export default Ember.Component.extend({
    // possible passed-in values with their defaults:
    content: null,
    prompt: null,
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
            const selectEl = this.$("select")[0];
            const selectedIndex = selectEl.selectedIndex;
            const content = this.get("content");

            // decrement index by 1 if we have a prompt
            const hasPrompt = !!this.get("prompt");
            const contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

            const selection = content.objectAt(contentIndex);

            this.set("selection", selection);

            // const changeCallback = this.get("action");
            // changeCallback(selection);
        }
    }
});
