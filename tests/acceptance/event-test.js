import { click, fillIn, find, findAll, currentURL, currentRouteName, visit } from '@ember/test-helpers';
/* eslint "max-len": 0 */
import { module, test } from "qunit";

import errorAt from "splittypie/tests/helpers/error-at";
import exist from "splittypie/tests/helpers/exist";
import identifyUserAs from "splittypie/tests/helpers/identify-user-as";
import reloadPage from "splittypie/tests/helpers/reload-page";
import runWithTestData from "splittypie/tests/helpers/run-with-test-data";
import setupApplicationTest from "splittypie/tests/helpers/setup-application-test";

module("Acceptance | event", function (hooks) {
    setupApplicationTest(hooks);

    test("creating event", async function (assert) {
        assert.expect(9);

        await visit("/");
        await click("a:contains('Create New Event')");
        // default values
        assert.ok(find('.event-currency option:checked').value !== "", "currency default");
        find(".event-currency").val("").trigger("change");
        await click("button:contains('Create')");
        assert.equal(errorAt(".event-name"), "This field can't be blank", "event name validation");
        assert.equal(errorAt(".event-currency"), "This field can't be blank", "event currency validation");
        assert.equal(errorAt(".user-name:eq(0)"), "This field can't be blank", "event user 1 validation");
        assert.equal(errorAt(".user-name:eq(1)"), "This field can't be blank", "event user 2 validation");

        await fillIn(".event-name", "Gift for John's Birthday");
        await fillIn(".event-currency", "USD");
        await fillIn(find('.user-name'), "Billy");
        await fillIn(findAll('.user-name')[1], "Alice");
        await click("button:contains('Create')");

        await reloadPage();
        // TODO: simulateDelay

        // check for event
        await click("a:contains('Edit')");
        assert.equal(find(".event-name").value, "Gift for John's Birthday", "event name value");
        assert.equal(find('.event-currency option:checked').value, "USD", "event currency value");
        assert.equal(find('.user-name').value, "Billy", "user 1 value");
        assert.equal(find(findAll('.user-name')[1]).value, "Alice", "user 2 value");
    });

    test("identifying user on first visit", function (assert) {
        runWithTestData("default", async events => {
            assert.expect(2);

            const event = events[0];

            // screen tell us who you are
            await visit(`${event.id}/edit`);

            const message = "Your friend Alice created an event \"Trip to Barcelona\"";

            assert.ok(exist(`div:contains('${message}')`), "your friend created event text");

            await click("button:contains('Bob')");
            assert.equal(currentURL(), `/${event.id}`, "accessed event page");
        });
    });

    test("changing user context", function (assert) {
        runWithTestData("default", async events => {
            const event = events[0];

            await identifyUserAs(event, "Alice");
            await visit(`/${event.id}`);

            assert.ok(exist(".btn-change-user:contains(Viewing as Alice)"), "viewing as Alice");

            await click(".btn-change-user");
            await click("a:contains(Daria)");

            assert.ok(exist(".btn-change-user:contains(Viewing as Daria)"), "viewing as Daria");
            assert.notOk(exist(".user-dropdown li a:contains(Daria)"), "cannot switch to Daria");

            await click(".btn-add-transaction");
            await click(".btn-add-with-details");

            assert.ok(
                exist(".transaction-payer option:selected:contains(Daria)"),
                "Daria is a new default"
            );
        });
    });

    test("changing event context", function (assert) {
        runWithTestData("default", async events => {
            const event = events[0];
            const event2 = events[1];

            await identifyUserAs(event, "Alice");
            await identifyUserAs(event2, "Tomasz");

            await visit(`/${event.id}`);

            assert.ok(exist(".btn-change-event:contains(Trip to Barcelona)"), "Trip to Barca");

            await click(".btn-change-event");
            await click(".dropdown a:contains(Trip to New York)");

            assert.ok(exist(".btn-change-event:contains(Trip to New York)"), "Trip to New York");
            assert.notOk(
                exist(".event-dropdown li a:contains(Trip to New York)"),
                "cannot switch to Trip to New York"
            );
        });
    });

    test("editing event", function (assert) {
        runWithTestData("default", async events => {
            assert.expect(6);

            const event = events[0];

            await identifyUserAs(event, "Alice");
            await visit(`/${event.id}/edit`);

            await fillIn(".event-currency", "EUR");
            await fillIn(".event-name", "Gift for John's Birthday");
            await fillIn(find('.user-name'), "Jimmy");
            await fillIn(findAll('.user-name')[1], "James");
            await click("button:contains('Add Participant')");
            await fillIn(findAll('.user-name')[4], "Johnny");
            await click("button:contains('Save')");

            //TODO: simulateDelaty

            await reloadPage();

            assert.equal(currentRouteName(), "event.index", "after save transition to overview");

            await click("a:contains('Edit')");
            assert.equal(find(".event-name").value, "Gift for John's Birthday", "event name value");
            assert.equal(find('.event-currency option:checked').value, "EUR", "event currency value");
            assert.equal(find('.user-name').value, "Jimmy", "user 1 value");
            assert.equal(find(findAll('.user-name')[1]).value, "James", "user 2 value");
            assert.equal(find(findAll('.user-name')[4]).value, "Johnny", "user 3 value");
        });
    });
});
