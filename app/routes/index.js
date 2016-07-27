import Ember from "ember";

export default Ember.Route.extend({
    renderTemplate() {
        this._super(...arguments);
        this.render("shared/footer", { into: "application", outlet: "footer" });
    },
});
