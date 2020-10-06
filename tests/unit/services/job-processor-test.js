import Service from "@ember/service";
import EmberObject from "@ember/object";
import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

const StoreMock = Service.extend({
});

module("Unit | Service | job processor", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
      this.owner.register("service:store", StoreMock);
      this.owner.register("service:online-store", StoreMock);
  });

  test("process throw an Exception when given job doesn't exist", function (assert) {
      assert.expect(1);

      const service = this.owner.lookup("service:job-processor");
      const nonExistentJob = EmberObject.create({
          name: "dummy",
          payload: '{ "id": 1 }',
      });

      assert.throws(() => {
          service.process(nonExistentJob);
      }, "throws exception");
  });
});
