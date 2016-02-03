import Ember from "ember";

export default Ember.Component.extend({
    anyEvents: Ember.computed.notEmpty("events"),
});
