import EmberObject from '@ember/object';
import { moduleFor, test } from "ember-qunit";

const StoreMock = EmberObject.extend({
});

moduleFor("service:job-processor", "Unit | Service | job processor", {
    beforeEach() {
        this.subject({
            store: StoreMock.create(),
            onlineStore: StoreMock.create(),
        });
    },
});

test("process throw an Exception when given job doesn't exist", function (assert) {
    assert.expect(1);

    const service = this.subject();
    const nonExistentJob = EmberObject.create({
        name: "dummy",
        payload: '{ "id": 1 }',
    });

    assert.throws(() => {
        service.process(nonExistentJob);
    }, "throws exception");
});
