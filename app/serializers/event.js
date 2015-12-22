import FirebaseSerializer from "emberfire/serializers/firebase";

export default FirebaseSerializer.extend({
    attrs: {
        users: {embedded: "always"},
        metaData: {embedded: "always"}
    }
});
