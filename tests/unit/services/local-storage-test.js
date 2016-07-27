import { moduleFor, test } from "ember-qunit";

const TESTENTRY = "testentry";

moduleFor("service:local-storage", "Unit | Service | local storage", {
    beforeEach() {
        window.localStorage.removeItem(TESTENTRY);
    },

    afterEach() {
        window.localStorage.removeItem(TESTENTRY);
    },
});

// Replace this with your real tests.
test("it exists", function (assert) {
    const service = this.subject();
    assert.ok(service);
});
