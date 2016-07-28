import Ember from "ember";

const {
    inject: { service },
    get,
    Route,
} = Ember;

export default Route.extend({
    modal: service(),
    notify: service(),
    transactionRepository: service(),

    actions: {
        settleUp(transfer) {
            get(this, "modal").trigger("show", {
                name: "settle-up",
                actions: {
                    yes: () => {
                        const event = this.modelFor("event");
                        const transaction = this.store.createRecord("transaction", {
                            payer: get(transfer, "sender"),
                            participants: [get(transfer, "recipient")],
                            amount: get(transfer, "amount"),
                            type: "transfer",
                            date: new Date().toISOString().substring(0, 10),
                        });

                        this.get("transactionRepository")
                            .save(event, transaction)
                            .then(() => {
                                get(this, "modal").trigger("hide");
                                get(this, "notify").success(
                                    "Everything settled"
                                );
                            })
                            .catch(() => {
                                get(this, "modal").trigger("hide");
                                get(this, "notify").error(
                                    "An error occured"
                                );
                            });
                    },
                },
                transfer,
            });
        },
    },
});
