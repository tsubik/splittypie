import { moduleFor, test } from "ember-qunit";

moduleFor("service:user-context", "Unit | Service | user context", {
    // Specify the other units that are required for this test.
    needs: ["service:local-storage"]
    /* beforeEach() {
     *     this.register('service:local-storage', LocalStorageMock);
     * } */
});

// Replace this with your real tests.
test("it exists", function (assert) {
    const service = this.subject();
    assert.ok(service);
});
