import EmberObject from "@ember/object";
import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

moduleForComponent("switch-user-dropdown", "Integration | Component | switch user dropdown", {
    integration: true,
});

test("it renders", function (assert) {
    const users = [
        EmberObject.create({ id: 1, name: "Tomasz" }),
        EmberObject.create({ id: 2, name: "Bob" }),
    ];

    this.set("users", users);
    this.set("selected", users[0]);
    this.set("onChange", () => {});

    this.render(hbs`{{switch-user-dropdown selected=selected users=users onChange=(action onChange)}}`);

    assert.equal(extraTrim(this.$().text()), "Viewing as Tomasz Switch user to Bob");
});
