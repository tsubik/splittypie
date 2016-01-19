import { test } from "qunit";
import moduleForAcceptance from "splitr-lite/tests/helpers/module-for-acceptance";
import errorAt from "splitr-lite/tests/helpers/error-at";

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
    // first transaction
    andThen(() => {
        click("button:contains('Create Transaction')");
    });
    //validations
    andThen(() => {
        assert.equal(errorAt(".transaction-payer"), "can't be blank", "transaction payer validation");
        assert.equal(errorAt(".transaction-name"), "can't be blank", "transaction name validation");
        assert.equal(errorAt(".transaction-amount"), "can't be blank,is not a number", "transaction amount validation");
        assert.equal(errorAt(".transaction-participants"), "can't be blank", "transaction participants validation");
    });
    //fill first transaction
    andThen(() => {
        const AliceId = find(".transaction-payer select option:contains('Alice')").val();
        fillIn(".transaction-payer", AliceId);
        fillIn(".transaction-name", "special bottle of vodka");
        fillIn(".transaction-amount", "50");
        click(".transaction-participants input");
        click("button:contains('Create Transaction')");
    });
    //check for transaction
    andThen(() => {
        assert.ok(!!find(".transaction-list-item:contains('Alice paid 50 USD for special bottle of vodka')").length, "transaction item");
    });
    //check for event
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

// test("adding users", function (assert) {
//     const store = this.store;
//     let event;

//     Ember.run(() => {
//         event = store.createRecord("event", {name: "New event"});
//         event.save();
//     });

//     visit(`/${event.get("id")}`);
//     addUser("Bob");
//     addUser("Alice");
//     andThen(() => {
//         assert.equal(find(".user-list .item").length, 2);
//         assert.equal(find(".user-list .item:eq(0) .user-name").text(), "Bob");
//         assert.equal(find(".user-list .item:eq(1) .user-name").text(), "Alice");
//     });
// });

// function addUser(name) {
//     click("button:contains('Add New User')");
//     fillIn(".user-name:last", name);
// }
