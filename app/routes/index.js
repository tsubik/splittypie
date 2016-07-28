import Ember from "ember";

const { Route } = Ember;

export default Route.extend({
    renderTemplate() {
        this._super(...arguments);
        this.render("shared/footer", { into: "application", outlet: "footer" });
    },
});
