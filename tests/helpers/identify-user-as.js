import Ember from "ember";

export default Ember.Test.registerAsyncHelper("identifyUserAs", function (app, event, user) {
    visit(`/${event.id}`);

    andThen(() => {
        click(`button:contains('${user}')`);
    });
});
