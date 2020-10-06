import Ember from "ember";

const {
    promise
} = Ember.Test;

export default function (action) {
    const syncQueue = this.owner.lookup("service:sync-queue");

    return promise((resolve) => {
        syncQueue.one("flushed", resolve);
        action();
    });
}
