import Ember from "ember";

export default Ember.Route.extend({
    model(params) {
        return this.store.find("event", params.id);
    },

    actions: {
        addTransaction() {
            const event = this.get("currentModel");
            const newTransaction = this.store.createRecord("transaction", {name: ""});

            event.get("transactions").pushObject(newTransaction);
        },

        addUser() {
            const event = this.get("currentModel");
            const newUser = this.store.createRecord("user", {name: ""});

            event.get("users").pushObject(newUser);
        },

        saveChanges() {
            this.currentModel.save();
        },

        willTransition() {
            return this.currentModel.save();
        }
    }
});
