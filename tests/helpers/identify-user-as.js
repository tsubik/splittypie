import { registerAsyncHelper } from "@ember/test";

registerAsyncHelper("identifyUserAs", function (app, event, user) {
    visit(`/${event.id}`);

    andThen(() => {
        click(`button:contains('${user}')`);
    });
});
