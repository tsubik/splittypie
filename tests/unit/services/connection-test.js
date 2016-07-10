import { moduleFor, test } from "ember-qunit";

moduleFor("service:connection", "Unit | Service | connection", {
});

function fakeOffline() {
    const event = new window.Event("offline");
    window.dispatchEvent(event);
}

function fakeOnline() {
    const event = new window.Event("online");
    window.dispatchEvent(event);
}

test("it has current navigator status", function (assert) {
    assert.expect(1);

    const isOnline = window.navigator.onLine;
    const service = this.subject();

    assert.equal(service.get("isOnline"), isOnline);
});

test("it changes state to online if connection state online", function (assert) {
    const service = this.subject();
    fakeOffline();

    assert.equal(service.get("state"), "offline");

    fakeOnline();

    assert.equal(service.get("state"), "online");
});
