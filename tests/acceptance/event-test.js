import { test } from "qunit";
import moduleForAcceptance from "splitr-lite/tests/helpers/module-for-acceptance";

moduleForAcceptance("Acceptance | event");

test("creating event", function (assert) {
    visit("/");
    click("button:contains('Create Event')");
    andThen(() => {
        assert.ok(!!find("h2:contains('Event Details')").length);
        assert.equal(currentRouteName(), "event");
    });
});
