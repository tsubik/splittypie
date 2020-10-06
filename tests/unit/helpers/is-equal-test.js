import { isEqual } from "splittypie/helpers/is-equal";
import { module, test } from "qunit";

module("Unit | Helper | is equal", function() {
  // Replace this with your real tests.
  test("it works", function (assert) {
      assert.ok(isEqual([1, 1]));
      assert.ok(isEqual([true, true]));
      assert.ok(isEqual(["test", "test"]));
  });
});
