import Ember from "ember";
import FirebaseAdapter from "emberfire/adapters/firebase";
import config from "../config/environment";
import DS from "ember-data";

const { inject } = Ember;

let adapter = FirebaseAdapter.extend({
    firebase: inject.service()
});

if (config.environment === "test") {
    adapter = DS.FixtureAdapter.extend({});
}

export default adapter;
