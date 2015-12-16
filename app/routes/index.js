import Ember from "ember";
import Event from "splitr-lite/models/event";

export default Ember.Route.extend({
    actions: {
        createEvent() {
            const newEvent = this.store.createRecord("event", {
                name: ""
            });
            newEvent.save();

            this.transitionTo("event", newEvent);
        }
    }
});
