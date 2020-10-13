import { registerAsyncHelper } from "@ember/test";
import { later } from "@ember/runloop";

registerAsyncHelper("simulateDelay", function (app, miliseconds) {
    return new Promise((resolve) => {
        later(resolve, miliseconds);
    });
});
