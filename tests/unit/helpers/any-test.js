import { any } from "splittypie/helpers/any";
import { module, test } from "qunit";

module("Unit | Helper | any");

// Replace this with your real tests.
test("it works", function (assert) {
    assert.ok(any([[20, 30]]), "not empty array");
    assert.notOk(any([[]]), "empty array");
    assert.notOk(any([undefined]), "undefined");
    assert.notOk(any([{}]), "not array");
});
