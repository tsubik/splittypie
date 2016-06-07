import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("switch-event-dropdown", "Integration | Component | switch event dropdown", {
    integration: true,
});

test("it renders", function (assert) {
    this.render(hbs`{{switch-event-dropdown}}`);

    assert.equal(this.$().text().trim(), "Add New Event");
});
