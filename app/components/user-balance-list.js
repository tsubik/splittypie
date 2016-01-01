import Ember from 'ember';

export default Ember.Component.extend({
    anyUsers: Ember.computed.notEmpty("users")
});
