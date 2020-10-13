import Model, { attr } from '@ember-data/model';

export default Model.extend({
    name: attr("string"),
    payload: attr("string"),
    createdAt: attr("date", {
        defaultValue() {
            return new Date();
        },
    }),
});
