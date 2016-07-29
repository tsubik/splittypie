/* eslint-disable */

const events = {
    testevent: {
        name: "Test event",
        currency: "USD",
        users: {
            user1: {
                name: "Tomasz",
                event: "testevent",
            },
            user2: {
                name: "Maciej",
                event: "testevent",
            },
        },
        transactions: {},
    },
};

for (let i = 0; i < 1000; i++) {
    events.testevent.transactions[`transaction_test_${i}`] = {
        name: `Test transaction ${i}`,
        amount: Math.floor(Math.random() * 500),
        payer: "user1",
        participants: {
            user1: true,
            user2: true,
        },
    };
}

exports["default"] = {
    events,
};
