import { registerAsyncHelper } from '@ember/test';

export default registerAsyncHelper("reloadPage", function (app) {
    const url = currentURL();

    app.buildRegistry();
    app.reset();
    visit(url);
});
