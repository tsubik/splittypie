import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    amount: DS.attr("number"),
    payer: DS.belongsTo("user", {async: false}),
    participants: DS.hasMany("user", {async: false})
});
