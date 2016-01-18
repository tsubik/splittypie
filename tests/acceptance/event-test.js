import { test } from "qunit";
import moduleForAcceptance from "splitr-lite/tests/helpers/module-for-acceptance";
// import Ember from "ember";

moduleForAcceptance("Acceptance | event", {
    needs: ["form:event"]
});

test("creating event", function (assert) {
    visit("/");
    click("a:contains('Start Now')");
    click("button:contains('Create Event')");
    // validations
    andThen(() => {
        // assert.ok(true);
        // assert.equal(find(".event-name").parent().find(".help-block.with-errors").text().trim(), "can't be blank");
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
