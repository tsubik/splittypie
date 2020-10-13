import {
  click,
  fillIn,
  find,
  findAll,
  visit
} from '@ember/test-helpers';
import moment from "moment";
import { module, test } from "qunit";

import exist from "splittypie/tests/helpers/exist";
import setupApplicationTest from "splittypie/tests/helpers/setup-application-test";
import runWithTestData from "splittypie/tests/helpers/run-with-test-data";
import identifyUserAs from "splittypie/tests/helpers/identify-user-as";
import reloadPage from "splittypie/tests/helpers/reload-page";

const expectTransactionListItem = (assert) => {
    const expectedMessage = "Alice paid for Dinner and coffee";

    assert.ok(exist(".transaction-list-item:contains('40.50 EUR')"));
    assert.ok(exist(`.transaction-list-item:contains('${expectedMessage}')`));
};

module("Acceptance | transaction", function (hooks) {
    setupApplicationTest(hooks);

    test("adding new transaction", function (assert) {
        runWithTestData("without-transactions", async events => {
            const event = events[0];

            identifyUserAs(event, "Alice");

            await visit(`/${event.id}/transactions`);
            assert.ok(exist("div:contains('There are no transactions yet')"));
            assert.ok(exist("div:contains('Add your first transaction')"));

            await click(".btn-add-transaction");
            await click(".btn-add-with-details");
            assert.equal(
                findAll(".transaction-participants input:checked").length,
                4,
                "Everyone selected by default"
            );
            const AliceId = find(".transaction-payer select option:contains('Alice')").value;

            await fillIn(".transaction-payer", AliceId);
            await fillIn(".transaction-name", "special bottle of vodka");
            await fillIn(".transaction-amount", "50");
            await click("button:contains('Create')");

            reloadPage();
            const expectedMessage = "Alice paid for special bottle of vodka";

            assert.ok(exist(".transaction-list-item:contains('50.00 EUR')"));
            assert.ok(exist(`.transaction-list-item:contains('${expectedMessage}')`));
            assert.notOk(exist("div:contains('Add your first transaction')"));
        });
    });

    test("editing/removing transaction", function (assert) {
        runWithTestData("default", async events => {
            const event = events[0];
            const BobId = "-KC0KtcY5FmUSrGOMHkE";

            identifyUserAs(event, "Alice");

            await visit(`/${event.id}/transactions`);
            assert.ok(exist(".transaction-list-item:contains('1,250.00 EUR')"));
            assert.ok(exist(".transaction-list-item:contains('John paid for Plane tickets')"));
            assert.ok(exist(".transaction-list-item:contains('Alice, John, Daria, Bob')"));

            await click(".transaction-list-item");
            await fillIn(".transaction-payer", BobId);
            await fillIn(".transaction-name", "special");
            await fillIn(".transaction-amount", "50");
            await fillIn(".transaction-date", "2016-07-07");
            await click("button:contains(Save)");

            // TODO: simulatedelay

            assert.ok(
                exist(".transaction-list-item:contains('50.00 EUR')"), "changed transaction amount"
            );
            assert.ok(
                exist(".transaction-list-item:contains('Bob paid for special')"),
                "changed transaction item"
            );
            assert.ok(
                exist(".transaction-list-item:contains('Alice, John, Daria, Bob')"),
                "changed transaction item participants"
            );
            assert.ok(
                exist(".transaction-list-date:contains('July 2016')"),
                "transaction in July 2016 as date was changed to"
            );
            assert.ok(
                exist(".month:contains(Jul) + .day:contains(07)"),
                "transaction exists on Jul 07"
            );

            await click(".transaction-list-item:contains('Bob paid for special')");
            await click("button.delete-transaction");

            assert.ok(exist("div:contains('Are you sure?')"), "delete confirmation");
            await click("button:contains('Yes')");
            assert.notOk(
                exist(".transaction-list-item:contains('Bob paid for special')"),
                "deleted transaction item"
            );
        });
    });

    test("quick transaction add", function (assert) {
        runWithTestData("without-transactions", async events => {
            const event = events[0];

            identifyUserAs(event, "Alice");

            await visit(`/${event.id}/transactions`);

            await click(".btn-add-transaction");
            await fillIn(".transaction-parse", "06/20 40.50 Dinner and coffee");

            expectTransactionListItem(assert);
            await click(".btn-add");

            await reloadPage();

            expectTransactionListItem(assert);
        });
    });

    test("quick transaction add with details", function (assert) {
        runWithTestData("without-transactions", async events => {
            const event = events[0];

            identifyUserAs(event, "Alice");

            await visit(`/${event.id}/transactions`);

            await click(".btn-add-transaction");
            await fillIn(".transaction-parse", "06/20 40.50 Dinner and coffee");

            expectTransactionListItem(assert);
            await click(".btn-add-with-details");

            assert.equal(
                findAll(".transaction-participants input:checked").length,
                4,
                "Everyone selected by default"
            );
            assert.equal(find(".transaction-name").value, "Dinner and coffee");
            assert.equal(find(".transaction-amount").value, "40.5");
            assert.equal(find(".transaction-date").value, moment("06/20", "MM/DD").format("YYYY-MM-DD"));

            await click("button:contains('Create')");

            await reloadPage();
            expectTransactionListItem(assert);
        });
    });
});
