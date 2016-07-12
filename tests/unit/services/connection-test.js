import { moduleFor, test } from "ember-qunit";

moduleFor("service:connection", "Unit | Service | connection", {
});

function changeConnectionStateTo(state) {
    const event = new window.Event(state);
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
    changeConnectionStateTo("offline");

    assert.equal(service.get("state"), "offline");

    changeConnectionStateTo("online");

    assert.equal(service.get("state"), "online");
});
