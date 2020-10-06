import { printMonthYear } from "splittypie/helpers/print-month-year";
import { module, test } from "qunit";

module("Unit | Helper | print month year", function() {
  test("it works", function (assert) {
      const result = printMonthYear(["2016-04"]);

      assert.equal(result, "April 2016");
  });
});
