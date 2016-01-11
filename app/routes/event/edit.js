import Ember from "ember";

export default Ember.Route.extend({
    actions: {
        addUser() {
            const event = this.modelFor("event");
            const newUser = this.store.createRecord("user");

            event.get("users").pushObject(newUser);
        }
    }
});
