import { isIncluded } from "../../../helpers/is-included";
import { module, test } from "qunit";

module("Unit | Helper | is included");

// Replace this with your real tests.
test("it works", function (assert) {
    assert.ok(isIncluded([42, [32, 12, 42]]));
    assert.ok(!isIncluded([41, []]));

    const items = [
        { id: 1, value: "test 1" },
        { id: 2, value: "test 2" },
    ];
    assert.ok(isIncluded([items[0], items]));
});
