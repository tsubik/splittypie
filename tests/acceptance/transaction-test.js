import moment from "moment";
import { test } from "qunit";
import moduleForAcceptance from "splittypie/tests/helpers/module-for-acceptance";

moduleForAcceptance("Acceptance | transaction");

const expectTransactionListItem = (assert) => {
    const expectedMessage = "Alice paid for Dinner and coffee";

    assert.ok(exist(".transaction-list-item:contains('40.50 EUR')"));
    assert.ok(exist(`.transaction-list-item:contains('${expectedMessage}')`));
};

test("adding new transaction", function (assert) {
    runWithTestData("without-transactions", (events) => {
        const event = events[0];

        identifyUserAs(event, "Alice");

        visit(`/${event.id}/transactions`);
        andThen(() => {
            assert.ok(exist("div:contains('There are no transactions yet')"));
            assert.ok(exist("div:contains('Add your first transaction')"));
        });

        click(".btn-add-transaction");
        click(".btn-add-with-details");
        // defaults
        andThen(() => {
            assert.equal(
                find(".transaction-participants input:checked").length,
                4,
                "Everyone selected by default"
            );
        });

        andThen(() => {
            const AliceId = find(".transaction-payer select option:contains('Alice')").val();

            fillIn(".transaction-payer", AliceId);
            fillIn(".transaction-name", "special bottle of vodka");
            fillIn(".transaction-amount", "50");
            click("button:contains('Create')");
        });

        reloadPage();
        // check for transaction
        andThen(() => {
            const expectedMessage = "Alice paid for special bottle of vodka";

            assert.ok(exist(".transaction-list-item:contains('50.00 EUR')"));
            assert.ok(exist(`.transaction-list-item:contains('${expectedMessage}')`));
            assert.notOk(exist("div:contains('Add your first transaction')"));
        });
    });
});

test("editing/removing transaction", function (assert) {
    runWithTestData("default", (events) => {
        const event = events[0];
        const BobId = "-KC0KtcY5FmUSrGOMHkE";

        identifyUserAs(event, "Alice");

        visit(`/${event.id}/transactions`);
        andThen(() => {
            assert.ok(exist(".transaction-list-item:contains('1,250.00 EUR')"));
            assert.ok(exist(".transaction-list-item:contains('John paid for Plane tickets')"));
            assert.ok(exist(".transaction-list-item:contains('Alice, John, Daria, Bob')"));
        });

        click(".transaction-list-item");
        fillIn(".transaction-payer", BobId);
        fillIn(".transaction-name", "special");
        fillIn(".transaction-amount", "50");
        fillIn(".transaction-date", "2016-07-07");
        click("button:contains(Save)");

        reloadPage();
        andThen(() => {
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
        });

        click(".transaction-list-item:contains('Bob paid for special')");
        click("button.delete-transaction");

        andThen(() => {
            assert.ok(exist("div:contains('Are you sure?')"), "delete confirmation");
        });
        click("button:contains('Yes')");
        andThen(() => {
            assert.notOk(
                exist(".transaction-list-item:contains('Bob paid for special')"),
                "deleted transaction item"
            );
        });
    });
});

test("quick transaction add", function (assert) {
    runWithTestData("without-transactions", (events) => {
        const event = events[0];

        identifyUserAs(event, "Alice");

        visit(`/${event.id}/transactions`);

        click(".btn-add-transaction");
        fillIn(".transaction-parse", "06/20 40.50 Dinner and coffee");

        // transaction list item as a preview of added transaction
        andThen(expectTransactionListItem.bind(this, assert));
        click(".btn-add");

        reloadPage();

        andThen(expectTransactionListItem.bind(this, assert));
    });
});

test("quick transaction add with details", function (assert) {
    runWithTestData("without-transactions", (events) => {
        const event = events[0];

        identifyUserAs(event, "Alice");

        visit(`/${event.id}/transactions`);

        click(".btn-add-transaction");
        fillIn(".transaction-parse", "06/20 40.50 Dinner and coffee");

        // transaction list item as a preview of added transaction
        andThen(expectTransactionListItem.bind(this, assert));
        click(".btn-add-with-details");

        andThen(() => {
            assert.equal(
                find(".transaction-participants input:checked").length,
                4,
                "Everyone selected by default"
            );
            assert.equal(find(".transaction-name").val(), "Dinner and coffee");
            assert.equal(find(".transaction-amount").val(), "40.5");
            assert.equal(find(".transaction-date").val(), moment("06/20", "MM/DD").format("YYYY-MM-DD"));
        });

        click("button:contains('Create')");

        reloadPage();

        andThen(expectTransactionListItem.bind(this, assert));
    });
});
