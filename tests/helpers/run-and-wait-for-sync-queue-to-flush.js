import Ember from "ember";

const { promise, registerAsyncHelper } = Ember.Test;

export default registerAsyncHelper("runAndWaitForSyncQueueToFlush", function (app, action) {
    const syncQueue = app.__container__.lookup("service:sync-queue");
    action();

    return promise((resolve) => {
        syncQueue.one("flushed", () => {
            resolve();
        });
    });
});
