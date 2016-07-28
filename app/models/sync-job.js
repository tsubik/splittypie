import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
    name: attr("string"),
    payload: attr("string"),
    createdAt: attr("date", {
        defaultValue() {
            return new Date();
        },
    }),
});
