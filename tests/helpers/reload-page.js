import { registerAsyncHelper } from "@ember/test";

registerAsyncHelper("reloadPage", function () {
    const url = currentURL();

    /* app.buildRegistry();
     * app.reset(); */
    visit(url);
});
