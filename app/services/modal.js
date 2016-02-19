import Ember from "ember";

export default Ember.Service.extend(Ember.Evented, {
    onConfirm(action) {
        this.trigger("show", {
            name: "confirm",
            actions: {
                ok: () => {
                    if (typeof action === "function") {
                        action();
                    }

                    this.trigger("hide");
                },
            },
        });
    },
});
