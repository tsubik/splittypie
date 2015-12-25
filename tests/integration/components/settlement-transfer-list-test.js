import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('settlement-transfer-list', 'Integration | Component | settlement transfer list', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{settlement-transfer-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#settlement-transfer-list}}
      template block text
    {{/settlement-transfer-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
