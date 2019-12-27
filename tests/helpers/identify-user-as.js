import { registerAsyncHelper } from "@ember/test";

export default registerAsyncHelper("identifyUserAs", function (app, event, user) {
    visit(`/${event.id}`);

    andThen(() => {
        click(`button:contains('${user}')`);
    });
});
