import Ember from "ember";

export default Ember.Component.extend({
    // possible passed-in values with their defaults:
    options: null,
    prompt: null,
    optionValuePath: "id",
    optionLabelPath: "title",
    action: Ember.K, // action to fire on change

    init() {
        this._super(...arguments);
        if (!this.get("options")) {
            this.set("options", []);
        }
    },

    valueDidChanged: Ember.on("init", Ember.observer("value", function () {
        const options = this.get("options");
        const value = this.get("value");

        if (value) {
            const key = this.get("optionValuePath");
            const selected = options.findBy(key, value);

            this.set("selected", selected);
        }
    })),

    actions: {
        change() {
            const selectEl = this.$("select")[0];
            const selectedIndex = selectEl.selectedIndex;
            const options = this.get("options");

            // decrement index by 1 if we have a prompt
            const hasPrompt = !!this.get("prompt");
            const contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

            const selected = options.objectAt(contentIndex);

            this.set("selected", selected);
            this.set("value", selected.get(this.get("optionValuePath")));

            // const changeCallback = this.get("action");
            // changeCallback(selection);
        },
    },
});
