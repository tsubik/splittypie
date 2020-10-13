import Evented from "@ember/object/evented";
import Service from "@ember/service";

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
