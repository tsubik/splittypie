import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            currencies: this.store.findAll("currency")
        });
    }
});
