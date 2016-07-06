import FirebaseSerializer from "emberfire/serializers/firebase";

export default FirebaseSerializer.extend({
    attrs: {
        isOffline: {
            serialize: false,
            deserialize: false,
        },
        users: { embedded: "always" },
        transactions: { embedded: "always" },
    },
});
