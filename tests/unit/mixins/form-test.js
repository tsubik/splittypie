import Ember from "ember";
import FormMixin from "../../../mixins/form";
import { module, test } from "qunit";

module("Unit | Mixin | form");

// Replace this with your real tests.
test("it works", function (assert) {
    const FormObject = Ember.Object.extend(FormMixin);
    const subject = FormObject.create();

    assert.ok(subject);
});
