import { registerAsyncHelper } from "@ember/test";
import Ember from "ember";

const {
    promise
} = Ember.Test;

registerAsyncHelper("runAndWaitForSyncQueueToFlush", function (app, action) {
    const syncQueue = app.__container__.lookup("service:sync-queue");

    return promise((resolve) => {
        syncQueue.one("flushed", resolve);
        action();
    });
});
