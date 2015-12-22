import FirebaseSerializer from "emberfire/serializers/firebase";

export default FirebaseSerializer.extend({
    attrs: {
        users: {embedded: "always"},
        transactions: {embedded: "always"},
        metaData: {embedded: "always"}
    }
});
