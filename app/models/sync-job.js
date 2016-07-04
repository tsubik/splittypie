import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    payload: DS.attr("string"),
});
