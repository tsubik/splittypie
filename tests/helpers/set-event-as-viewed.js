import EmberObject from "@ember/object";
import { registerAsyncHelper } from "@ember/test";

registerAsyncHelper("setEventAsViewed", function (app, event, userName) {
    const localStorage = app.__container__.lookup("service:localStorage");
    const store = app.__container__.lookup("service:store");

    return store.findRecord("event", event.id).then((e) => {
        const user = e.get("users").findBy("name", userName);

        if (user) {
            const eventToSave = EmberObject.create({
                id: event.id,
                name: event.name,
                userId: user.get("id"),
            });

            localStorage.push("events", eventToSave);
        }
    });
});
