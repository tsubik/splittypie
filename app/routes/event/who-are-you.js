import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import Route from "@ember/routing/route";

export default Route.extend({
    userContext: service(),

    renderTemplate() {
        this.render({ into: "application" });
    },

    actions: {
        chooseUser(user) {
            const event = this.modelFor("event");

            this.userContext.change(event, user);
            this.transitionTo("event.index", event);
        },
    },
});
