import Ember from "ember";

export default Ember.LinkComponent.extend({
    sideMenu: Ember.inject.service(),

    click() {
        this.get("sideMenu").hide();
    },
});
