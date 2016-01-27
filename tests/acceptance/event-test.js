/* eslint "max-len": 0 */
import { test } from "qunit";
import moduleForAcceptance from "splitr-lite/tests/helpers/module-for-acceptance";
import errorAt from "splitr-lite/tests/helpers/error-at";
import Ember from "ember";

moduleForAcceptance("Acceptance | event");

test("creating event and first transaction", function (assert) {
    visit("/");
    click("a:contains('Start Now')");
    click("button:contains('Create Event')");
    // validations
    andThen(() => {
        assert.equal(errorAt(".event-name"), "can't be blank", "event name validation");
        assert.equal(errorAt(".event-currency"), "can't be blank", "event currency validation");
        assert.equal(errorAt(".user-name:eq(0)"), "can't be blank", "event user 1 validation");
        assert.equal(errorAt(".user-name:eq(1)"), "can't be blank", "event user 2 validation");
    });
    andThen(() => {
        fillIn(".event-name", "Gift for John's Birthday");
        fillIn(".event-currency", "USD");
        fillIn(".user-name:eq(0)", "Billy");
        fillIn(".user-name:eq(1)", "Alice");
        click("button:contains('Create Event')");
    });
    reloadPage();
    // first transaction
    andThen(() => {
        click("button:contains('Create Transaction')");
    });
    // validations
    andThen(() => {
        assert.equal(errorAt(".transaction-payer"), "can't be blank", "transaction payer validation");
        assert.equal(errorAt(".transaction-name"), "can't be blank", "transaction name validation");
        assert.equal(errorAt(".transaction-amount"), "can't be blank,is not a number", "transaction amount validation");
        assert.equal(errorAt(".transaction-participants"), "can't be blank", "transaction participants validation");
    });
    // fill first transaction
    andThen(() => {
        const AliceId = find(".transaction-payer select option:contains('Alice')").val();
        fillIn(".transaction-payer", AliceId);
        fillIn(".transaction-name", "special bottle of vodka");
        fillIn(".transaction-amount", "50");
        click(".transaction-participants input");
        click("button:contains('Create Transaction')");
    });
    reloadPage();
    // check for transaction
    andThen(() => {
        const expectedMessage = "Alice paid 50 USD for special bottle of vodka";

        assert.ok(
            exist(`.transaction-list-item:contains('${expectedMessage}')`),
            "transaction item"
        );
    });
    // check for event
    andThen(() => {
        click("a:contains('Edit Event')");
    });
    andThen(() => {
        assert.equal(find(".event-name").val(), "Gift for John's Birthday", "event name value");
        assert.equal(find(".event-currency option:selected").val(), "USD", "event currency value");
        assert.equal(find(".user-name:eq(0)").val(), "Billy", "user 1 value");
        assert.equal(find(".user-name:eq(1)").val(), "Alice", "user 2 value");
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
        visit(`/${event.id}/edit`);
        fillIn(".event-name", "Gift for John's Birthday");
        fillIn(".event-currency", "EUR");
        fillIn(".user-name:eq(0)", "Jimmy");
        fillIn(".user-name:eq(1)", "James");
        click("button:contains('Add Participant')");
        fillIn(".user-name:eq(2)", "Johnny");
        click("button:contains('Save Changes')");
    });
    reloadPage();
    andThen(() => {
        // assert.equal(false, true, "dupa");
        assert.equal(currentRouteName(), "event.overview", "after save transition to overview");
        click("a:contains('Edit')");
    });

    andThen(() => {
        assert.equal(find(".event-name").val(), "Gift for John's Birthday", "event name value");
        assert.equal(find(".event-currency option:selected").val(), "EUR", "event currency value");
        assert.equal(find(".user-name:eq(0)").val(), "Jimmy", "user 1 value");
        assert.equal(find(".user-name:eq(1)").val(), "James", "user 2 value");
        assert.equal(find(".user-name:eq(2)").val(), "Johnny", "user 3 value");
    });
});
