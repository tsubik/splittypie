import { moduleForModel, test } from "ember-qunit";

moduleForModel("transaction", "Unit | Model | transaction", {
    // Specify the other units that are required for this test.
    needs: ["model:user", "model:event"]
});

test("it exists", function (assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
