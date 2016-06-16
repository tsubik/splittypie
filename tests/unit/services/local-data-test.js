import { moduleFor, test } from "ember-qunit";

moduleFor("service:local-data", "Unit | Service | local data", {
    // Specify the other units that are required for this test.
    needs: ["service:local-storage"],
});

// Replace this with your real tests.
test("it exists", function (assert) {
    const service = this.subject();
    assert.ok(service);
});
