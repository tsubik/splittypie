import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import Ember from "ember";
import extraTrim from "../../helpers/extra-trim";

moduleForComponent("transaction-list-item", "Integration | Component | transaction list item", {
    integration: true
});

test("it renders", function (assert) {
    assert.expect(1);

    const users = [
        { id: 1, name: "Bob" },
        { id: 2, name: "John" },
        { id: 3, name: "Billy" }
    ];

    const transaction = Ember.Object.create({
        payer: users[1],
        name: "Gift for Alice",
        amount: "200",
        participants: users.slice(1),
        event: {
            currency: { code: "USD" }
        }
    });

    this.set("transaction", transaction);
    this.render(hbs`{{transaction-list-item transaction=transaction}}`);

    assert.equal(extraTrim(this.$().text()), "John paid 200 USD for Gift for Alice Participants: John, Billy");
});
