import Ember from "ember";

export default Ember.Route.extend({
    actions: {
        createEvent() {
            this.store
                .createRecord("event", {
                    name: ""
                })
                .save()
                .then((event) => {
                    this.transitionTo("event", event);
                });
        }
    }
});
