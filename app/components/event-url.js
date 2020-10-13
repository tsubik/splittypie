import { later } from "@ember/runloop";
import TextField from "@ember/component/text-field";

export default TextField.extend({
    readonly: true,

    classNames: ["event-url"],

    didInsertElement() {
        this._super(...arguments);

        // workaround select after animations
        later(() => {
            this.$().focus().select();
        }, 500);
    },
});
