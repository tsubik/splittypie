import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    currency: DS.belongsTo("currency", {async: false}),
    users: DS.hasMany("user", {async: false}),
    transactions: DS.hasMany("transaction", {async: false})
});
