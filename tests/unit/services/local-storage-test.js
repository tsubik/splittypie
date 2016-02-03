import { moduleFor, test } from "ember-qunit";
import Ember from "ember";

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

test("it raises error if push with no argument provided", function (assert) {
    const service = this.subject();

    assert.throws(
        () => service.push(),
        "throws argument error"
    );
});

test("it raises error if pushing object without id property", function (assert) {
    const service = this.subject();
    const item = Ember.Object.create({
        name: "Something",
    });

    assert.throws(
        () => service.push(TESTENTRY, item),
        "throws missing id property error"
    );
});

test("it stores simple objects", function (assert) {
    const service = this.subject();
    const item = Ember.Object.create({
        id: 1,
        name: "Something",
    });

    service.push(TESTENTRY, item);
    const foundItem = service.findAll(TESTENTRY)[0];

    assert.equal(foundItem.id, item.id);
    assert.equal(foundItem.name, item.name);
});

test("it updates stored element if id matches", function (assert) {
    const service = this.subject();
    const item = Ember.Object.create({
        id: 1,
        name: "Something",
    });

    service.push(TESTENTRY, item);
    let foundItem = service.findAll(TESTENTRY).findBy("id", item.id);

    assert.equal(foundItem.name, item.name);
    item.name = "Updated name";

    service.push(TESTENTRY, item);
    foundItem = service.findAll(TESTENTRY).findBy("id", item.id);

    assert.equal(foundItem.name, item.name);
});
