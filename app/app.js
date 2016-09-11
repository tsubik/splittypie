import Ember from "ember";
import loadInitializers from "ember-load-initializers";
import config from "./config/environment";
import Resolver from "./resolver";

Ember.MODEL_FACTORY_INJECTIONS = true;

const App = Ember.Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver,
});

loadInitializers(App, config.modulePrefix);

export default App;
