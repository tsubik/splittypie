import Ember from "ember";

export default Ember.Test.registerAsyncHelper("setEventAsViewed", function (app, event, userName) {
    const localStorage = app.__container__.lookup("service:localStorage");
    const store = app.__container__.lookup("service:store");

    return store.findRecord("event", event.id).then((e) => {
        const user = e.get("users").findBy("name", userName);

        if (user) {
            const eventToSave = Ember.Object.create({
                id: event.id,
                name: event.name,
                userId: user.get("id"),
            });

            localStorage.push("events", eventToSave);
        }
    });
});
