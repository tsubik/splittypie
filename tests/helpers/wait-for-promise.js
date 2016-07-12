import Ember from "ember";

export default Ember.Test.registerAsyncHelper("waitForPromise", function (app, promise) {
    return Ember.Test.promise((resolve) => {
        Ember.Test.adapter.asyncStart();
        promise().then((value) => {
            resolve(value);
            Ember.Test.adapter.asyncEnd();
        });
    });
});
