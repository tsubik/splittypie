/* eslint "max-len": 0 */
import { test } from "qunit";
import moduleForAcceptance from "splittypie/tests/helpers/module-for-acceptance";
import errorAt from "splittypie/tests/helpers/error-at";
import Ember from "ember";

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
    let event;

    waitForPromise(new Ember.RSVP.Promise((resolve) => {
        Ember.run(() => {
            this.store.findRecord("currency", "USD").then((currency) => {
                event = this.store.createRecord("event", {
                    name: "Test event",
                    currency,
                    users: [
                        this.store.createRecord("user", { name: "Alice" }),
                        this.store.createRecord("user", { name: "Bob" }),
                    ],
                });
                event.save().then(resolve);
            });
        });
    }));

    // screen tell us who you are
    andThen(() => {
        visit(`/${event.id}/edit`);
    });
    andThen(() => {
        const message = "Your friend Alice created an event \"Test event\"";

        assert.ok(exist(`div:contains('${message}')`), "your friend created event text");
    });

    click("button:contains('Bob')");
    andThen(() => {
        assert.equal(currentURL(), `/${event.id}`, "accessed event page");
    });
});

test("editing event", function (assert) {
    let event;

    waitForPromise(new Ember.RSVP.Promise((resolve) => {
        Ember.run(() => {
            this.store.findRecord("currency", "USD").then((currency) => {
                event = this.store.createRecord("event", {
                    name: "Test event",
                    currency,
                    users: [
                        this.store.createRecord("user", { name: "Alice" }),
                        this.store.createRecord("user", { name: "Bob" }),
                    ],
                });
                event.save().then(resolve);
            });
        });
    }));

    andThen(() => {
        identifyUserAs(event.id, "Bob");
        visit(`/${event.id}/edit`);
    });

    fillIn(".event-currency", "EUR");
    fillIn(".event-name", "Gift for John's Birthday");
    fillIn(".user-name:eq(0)", "Jimmy");
    fillIn(".user-name:eq(1)", "James");
    click("button:contains('Add Participant')");
    fillIn(".user-name:eq(2)", "Johnny");
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
        assert.equal(find(".user-name:eq(2)").val(), "Johnny", "user 3 value");
    });
});
