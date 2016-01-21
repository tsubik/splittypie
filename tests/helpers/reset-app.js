import Ember from "ember";

export default Ember.Test.registerAsyncHelper("resetApp", function(app) {
    const url = currentURL();

    app.buildRegistry();
    app.reset();
    visit(url);
});
