import Ember from "ember";

export default Ember.Component.extend({
    sideMenu: Ember.inject.service(),

    classNames: ["side-menu"],
    classNameBindings: ["sideMenu.isOpen:open"],
});
