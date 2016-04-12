import Ember from "ember";

export default Ember.Test.registerAsyncHelper("identifyUserAs", function (app, eventId, user) {
    visit(`/${eventId}`);

    andThen(() => {
        click(`button:contains('${user}')`);
    });
});
