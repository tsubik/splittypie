import Ember from 'ember';
import EventRouteMixinMixin from '../../../mixins/event-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | event route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let EventRouteMixinObject = Ember.Object.extend(EventRouteMixinMixin);
  let subject = EventRouteMixinObject.create();
  assert.ok(subject);
});
