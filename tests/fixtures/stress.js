/* eslint-disable */

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

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

for (let i = 0; i < 500; i++) {
    const date = randomDate(new Date(2016, 6, 1), new Date());

    events.testevent.transactions[`transaction_test_${i}`] = {
        name: `Test transaction ${i}`,
        amount: Math.floor(Math.random() * 500),
        payer: "user1",
        date: date.toISOString().substring(0, 10),
        participants: {
            user1: true,
            user2: true,
        },
    };
}

export default {
    events,
};
