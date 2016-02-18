import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("switch-event-dropdown", "Integration | Component | switch event dropdown", {
    integration: true,
});

test("it renders", function (assert) {
    // Set any properties with this.set("myProperty", "value");
    // Handle any actions with this.on("myAction", function(val) { ... });" + EOL + EOL +

    this.render(hbs`{{switch-event-dropdown}}`);

    assert.equal(this.$().text().trim(), "Add New Event");
});
