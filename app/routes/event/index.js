import Ember from "ember";

const { service } = Ember.inject;

export default Ember.Route.extend({
    modal: service(),
    notify: service(),
    transactionRepository: service(),

    actions: {
        settleUp(transfer) {
            this.get("modal").trigger("show", {
                name: "settle-up",
                actions: {
                    yes: () => {
                        const event = this.modelFor("event");
                        const transaction = this.store.createRecord("transaction", {
                            payer: transfer.get("sender"),
                            participants: [transfer.get("recipient")],
                            amount: transfer.get("amount"),
                            type: "transfer",
                            date: new Date().toISOString().substring(0, 10),
                        });

                        this.get("transactionRepository")
                            .save(event, transaction)
                            .then(() => {
                                this.get("modal").trigger("hide");
                                this.get("notify").success(
                                    "Everything settled"
                                );
                            })
                            .catch(() => {
                                this.get("modal").trigger("hide");
                                this.get("notify").error(
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
