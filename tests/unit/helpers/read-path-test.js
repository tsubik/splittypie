import { readPath } from "splitr-lite/helpers/read-path";
import { module, test } from "qunit";
import Ember from "ember";

module("Unit | Helper | read path");

// Replace this with your real tests.
test("it works", function (assert) {
    const object = Ember.Object.create({
        property: "test"
    });

    assert.equal(readPath([object, "property"]), "test");
});
