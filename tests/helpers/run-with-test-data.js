/* eslint-disable global-require */

import Ember from "ember";

const toArray = function (firebaseObject) {
    const results = [];

    if (firebaseObject) {
        Object.keys(firebaseObject).forEach((key) => {
            const item = firebaseObject[key];

            item.id = key;
            results.push(item);
        });
    }

    return results;
};

export default Ember.Test.registerAsyncHelper(
    "runWithTestData",
    function (app, dumpName, functionToRun) {
        const eventsRef = app.__container__.lookup("service:firebaseApp").database().ref("events");
        const dump = require(`splittypie/tests/fixtures/${dumpName}`).default;
        const events = toArray(dump.events);

        return new Ember.RSVP.Promise((resolve, reject) => {
            const loadData = Ember.RSVP.all(events.map((e) => eventsRef.child(e.id).set(e)));

            loadData.then(function () {
                functionToRun(events);
                return andThen(function () {
                    return Ember.RSVP.all(events.map((e) => eventsRef.child(e.id).remove()));
                });
            }).then(resolve).catch(reject);
        });
    }
);
