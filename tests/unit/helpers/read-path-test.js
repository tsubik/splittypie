import EmberObject from "@ember/object";
import { readPath } from "splittypie/helpers/read-path";
import { module, test } from "qunit";

module("Unit | Helper | read path", function() {
  // Replace this with your real tests.
  test("it works", function (assert) {
      const object = EmberObject.create({
          property: "test",
      });

      assert.equal(readPath([object, "property"]), "test");
  });
});
