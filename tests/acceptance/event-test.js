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
        assert.ok(find(".event-name option:selected").val() !== "", "currency default");
    });
    fillIn(".event-currency", "");
    click("button:contains('Create')");
    // validations
    andThen(() => {
        assert.equal(errorAt(".event-name"), "can't be blank", "event name validation");
        assert.equal(errorAt(".event-currency"), "can't be blank", "event currency validation");
        assert.equal(errorAt(".user-name:eq(0)"), "can't be blank", "event user 1 validation");
        assert.equal(errorAt(".user-name:eq(1)"), "can't be blank", "event user 2 validation");
    });

    fillIn(".event-name", "Gift for John's Birthday");
    fillIn(".event-currency", "USD");
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
    window.localStorage.removeItem("events");

    runWithTestData("default", () => {
        // screen tell us who you are
        visit("testId/edit");

        andThen(() => {
            const message = "Your friend Alice created an event \"Trip to Barcelona\"";

            assert.ok(exist(`div:contains('${message}')`), "your friend created event text");
        });

        click("button:contains('Bob')");
        andThen(() => {
            assert.equal(currentURL(), "/testId", "accessed event page");
        });
    });
});

test("changing user context", function (assert) {
    window.localStorage.removeItem("events");

    runWithTestData("default", (events) => {
        const event = events[0];

        identifyUserAs(event.id, "Alice");
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

test("editing event", function (assert) {
    runWithTestData("default", (events) => {
        const event = events[0];

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
