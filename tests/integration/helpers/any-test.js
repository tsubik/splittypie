import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("any", "Integration | Helper | any", {
    integration: true,
});

test("not empty array", function (assert) {
    this.set("array", [20, 30]);

    this.render(hbs`
{{#if (any array)}}
true
{{/if}}
`);

    assert.equal(this.$().text().trim(), "true");
});

test("empty array", function (assert) {
    this.set("array", []);

    this.render(hbs`
{{#if (any array)}}
true
{{/if}}
`);

    assert.equal(this.$().text().trim(), "");
});

test("undefined", function (assert) {
    this.set("array", undefined);

    this.render(hbs`
{{#if (any array)}}
true
{{/if}}
`);

    assert.equal(this.$().text().trim(), "");
});

test("not array", function (assert) {
    this.set("array", {});

    this.render(hbs`
{{#if (any array)}}
true
{{/if}}
`);

    assert.equal(this.$().text().trim(), "");
});
