/* eslint "max-len": 0 */
import { test } from "qunit";
import moduleForAcceptance from "splittypie/tests/helpers/module-for-acceptance";
import errorAt from "splittypie/tests/helpers/error-at";

moduleForAcceptance("Acceptance | event");

test("creating event", function (assert) {
    visit("/");
    click("a:contains('Create New Event')");
    andThen(() => {
        // default values
        assert.ok(find(".event-currency option:selected").val() !== "", "currency default");
        find(".event-currency").val("").trigger("change");
    });
    // fillIn(".event-currency", "");
    click("button:contains('Create')");
    // validations
    andThen(() => {
        assert.equal(errorAt(".event-name"), "This field can't be blank", "event name validation");
        assert.equal(errorAt(".event-currency"), "This field can't be blank", "event currency validation");
        assert.equal(errorAt(".user-name:eq(0)"), "This field can't be blank", "event user 1 validation");
        assert.equal(errorAt(".user-name:eq(1)"), "This field can't be blank", "event user 2 validation");
    });

    fillIn(".event-name", "Gift for John's Birthday");
    // FIXME: temporary fix, fillIn doesn't work properly with select elements
    andThen(() => {
        find(".event-currency").val("USD").trigger("change");
    });
    // fillIn(".event-currency", "USD");
    fillIn(".user-name:eq(0)", "Billy");
    fillIn(".user-name:eq(1)", "Alice");
    click("button:contains('Create')");

    reloadPage();

    // check for event
    click("a:contains('Edit')");
    andThen(() => {
        assert.equal(find(".event-name").val(), "Gift for John's Birthday", "event name value");
        assert.equal(find(".event-currency option:selected").val(), "USD", "event currency value");
        assert.equal(find(".user-name:eq(0)").val(), "Billy", "user 1 value");
        assert.equal(find(".user-name:eq(1)").val(), "Alice", "user 2 value");
    });
});

test("identifying user on first visit", function (assert) {
    runWithTestData("default", (events) => {
        const event = events[0];

        // screen tell us who you are
        visit(`${event.id}/edit`);

        andThen(() => {
            const message = "Your friend Alice created an event \"Trip to Barcelona\"";

            assert.ok(exist(`div:contains('${message}')`), "your friend created event text");
        });

        click("button:contains('Bob')");
        andThen(() => {
            assert.equal(currentURL(), `/${event.id}`, "accessed event page");
        });
    });
});

test("changing user context", function (assert) {
    runWithTestData("default", (events) => {
        const event = events[0];

        identifyUserAs(event, "Alice");
        visit(`/${event.id}`);

        andThen(() => {
            assert.ok(exist(".btn-change-user:contains(Viewing as Alice)"), "viewing as Alice");
        });

        click(".btn-change-user");
        click("a:contains(Daria)");

        andThen(() => {
            assert.ok(exist(".btn-change-user:contains(Viewing as Daria)"), "viewing as Daria");
            assert.notOk(exist(".user-dropdown li a:contains(Daria)"), "cannot switch to Daria");
        });

        click(".btn-add-transaction");

        andThen(() => {
            assert.ok(
                exist(".transaction-payer option:selected:contains(Daria)"),
                "Daria is default"
            );
        });
    });
});

test("changing event context", function (assert) {
    runWithTestData("default", (events) => {
        const event = events[0];
        const event2 = events[1];

        identifyUserAs(event, "Alice");
        identifyUserAs(event2, "Tomasz");

        visit(`/${event.id}`);

        andThen(() => {
            assert.ok(exist(".btn-change-event:contains(Trip to Barcelona)"), "Trip to Barca");
        });

        click(".btn-change-event");
        click(".dropdown a:contains(Trip to New York)");

        andThen(() => {
            assert.ok(exist(".btn-change-event:contains(Trip to New York)"), "Trip to New York");
            assert.notOk(
                exist(".event-dropdown li a:contains(Trip to New York)"),
                "cannot switch to Trip to New York"
            );
        });
    });
});

test("editing event", function (assert) {
    runWithTestData("default", (events) => {
        const event = events[0];

        identifyUserAs(event, "Alice");
        visit(`/${event.id}/edit`);

        fillIn(".event-currency", "EUR");
        fillIn(".event-name", "Gift for John's Birthday");
        fillIn(".user-name:eq(0)", "Jimmy");
        fillIn(".user-name:eq(1)", "James");
        click("button:contains('Add Participant')");
        fillIn(".user-name:eq(4)", "Johnny");
        click("button:contains('Save')");

        reloadPage();
        andThen(() => {
            assert.equal(currentRouteName(), "event.index", "after save transition to overview");
        });

        click("a:contains('Edit')");
        andThen(() => {
            assert.equal(find(".event-name").val(), "Gift for John's Birthday", "event name value");
            assert.equal(find(".event-currency option:selected").val(), "EUR", "event currency value");
            assert.equal(find(".user-name:eq(0)").val(), "Jimmy", "user 1 value");
            assert.equal(find(".user-name:eq(1)").val(), "James", "user 2 value");
            assert.equal(find(".user-name:eq(4)").val(), "Johnny", "user 3 value");
        });
    });
});
