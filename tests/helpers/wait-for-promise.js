import { registerAsyncHelper } from "@ember/test";
import Ember from "ember";

export default registerAsyncHelper("waitForPromise", function (app, promise) {
    return Ember.Test.promise((resolve) => {
        Ember.Test.adapter.asyncStart();
        promise().then((value) => {
            resolve(value);
            Ember.Test.adapter.asyncEnd();
        });
    });
});
