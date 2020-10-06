import { module, test } from "qunit";
import { isNot } from "../../../helpers/is-not";

module("Unit | Helper | is not", function() {
  // Replace this with your real tests.
  test("it works", function (assert) {
      const result = isNot([false]);

      assert.ok(result);
  });
});
