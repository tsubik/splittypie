/* eslint-disable newline-per-chained-call */

import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("my-select", "Integration | Component | my select", {
    integration: true,
});

test("it renders", function (assert) {
    const items = [
        { value: 1, label: "Label for value 1" },
        { value: 2, label: "Label for value 2" },
    ];

    this.set("items", items);

    this.render(hbs`{{my-select options=items optionValuePath="value" optionLabelPath="label"}}`);

    assert.equal(this.$("option").length, 2);
    assert.equal(this.$("option").eq(0).text().trim(), "Label for value 1");
    assert.equal(this.$("option").eq(1).text().trim(), "Label for value 2");
});

test("it selects selected element", function (assert) {
    const items = [
        { value: 1, label: "Label for value 1" },
        { value: 2, label: "Label for value 2" },
    ];

    this.set("items", items);
    this.set("selected", items[1]);

    this.render(hbs`
{{my-select options=items selected=selected optionValuePath="value" optionLabelPath="label"}}
`);

    assert.equal(this.$("option").length, 2);
    assert.equal(this.$("option").eq(0).is(":selected"), false);
    assert.equal(this.$("option").eq(1).is(":selected"), true);
});

test("it renders prompt if provided", function (assert) {
    const items = [
        { value: 1, label: "Label for value 1" },
        { value: 2, label: "Label for value 2" },
    ];

    this.set("items", items);
    this.render(hbs`
{{my-select prompt="Select item..." options=items optionValuePath="value" optionLabelPath="label"}}
`);

    assert.equal(this.$("option").length, 3);
    assert.equal(this.$("option").eq(0).text().trim(), "Select item...");
    assert.equal(this.$("option").eq(1).text().trim(), "Label for value 1");
    assert.equal(this.$("option").eq(2).text().trim(), "Label for value 2");
});
