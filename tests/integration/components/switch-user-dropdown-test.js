import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";
import extraTrim from "../../helpers/extra-trim";

moduleForComponent("switch-user-dropdown", "Integration | Component | switch user dropdown", {
    integration: true,
});

test("it renders", function (assert) {
    const users = [
        Ember.Object.create({ id: 1, name: "Tomasz" }),
        Ember.Object.create({ id: 2, name: "Bob" }),
    ];

    this.set("users", users);
    this.set("selected", users[0]);

    this.render(hbs`{{switch-user-dropdown selected=selected users=users}}`);

    assert.equal(extraTrim(this.$().text()), "Viewing as Tomasz Switch user to Bob");
});
