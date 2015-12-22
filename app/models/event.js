import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    users: DS.hasMany("user", {async: false}),
    transactions: DS.hasMany("transaction", {async: false}),
    metaData: DS.belongsTo("event", {async: false})
});
