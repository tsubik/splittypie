import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("transaction-list", "Integration | Component | transaction list", {
    integration: true
});

test("it renders", function(assert) {

    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

    this.render(hbs`{{transaction-list}}`);

    assert.equal(this.$().text().trim(), "");
});
