import Ember from "ember";

export default Ember.Controller.extend({
    actions: {
        addUser() {
            const event = this.get("model");
            const newUser = this.store.createRecord("user", {name: ""});

            event.get("users").pushObject(newUser);
            // workaround object added twice on template
            event.save().then(() => {
                this.get("content").reload();
            });
        },

        addTransaction() {
            const event = this.get("model");
            const newTransaction = this.store.createRecord("transaction", {name: ""});

            event.get("transactions").pushObject(newTransaction);

            event.save().then(() => {
                this.get("content").reload();
            });
        },

        deleteUser(user) {
            const event = this.get("model");

            event.get("users").removeObject(user);
            event.save();
        },

        deleteTransaction(transaction) {
            const event = this.get("model");

            event.get("transactions").removeObject(transaction);
            event.save();
        },

        saveChanges() {
            this.get("model").save();
        }
    }
});
