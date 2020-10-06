/* eslint-disable global-require */

import { debug } from "@ember/debug";

import { Promise, all } from "rsvp";

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

export default function (dumpName, functionToRun) {
    const eventsRef = this.owner.lookup("service:firebaseApp").database().ref("events");
    // eslint-disable-next-line
    const dump = require(`splittypie/tests/fixtures/${dumpName}`).default;
    const events = toArray(dump.events);

    return new Promise((resolve, reject) => {
        const loadData = all(events.map(e => eventsRef.child(e.id).set(e)));

        loadData.then(function () {
            functionToRun(events);
            return andThen(function () {
                debug("Clearing TEST DATA");
                return all(events.map(e => eventsRef.child(e.id).remove()));
            });
        }).then(resolve).catch(reject);
    });
}
