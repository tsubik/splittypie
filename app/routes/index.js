import Route from '@ember/routing/route';

export default Route.extend({
    renderTemplate() {
        this._super(...arguments);
        this.render("shared/footer", { into: "application", outlet: "footer" });
    },
});
