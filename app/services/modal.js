import Ember from "ember";

const { Evented, Service } = Ember;

export default Service.extend(Evented, {
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
