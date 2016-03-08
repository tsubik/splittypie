import Ember from "ember";

export default Ember.Service.extend({
    // progress 0-100 %
    progress: 0,
    isOpen: Ember.computed.equal("progress", 100),
    isClosed: Ember.computed.equal("progress", 0),

    hide() {
        this.set("progress", 0);
    },

    show() {
        this.set("progress", 100);
    },

    toggle() {
        if (this.get("isOpen")) {
            this.hide();
        } else {
            this.show();
        }
    },
});
