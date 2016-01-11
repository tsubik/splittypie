import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord("event", {
            users: [
                this.store.createRecord("user"),
                this.store.createRecord("user")
            ]
        });
    },

    actions: {
        createEvent() {
            this.currentModel.save()
                .then((event) => {
                    this.transitionTo("event.transactions.new", event);
                });
        }
    }
});
