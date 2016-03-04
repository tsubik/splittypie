import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('side-menu-link-to', 'Integration | Component | side menu link to', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{side-menu-link-to}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#side-menu-link-to}}
      template block text
    {{/side-menu-link-to}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
