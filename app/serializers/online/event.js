import RealtimeDatabaseSerializer from "emberfire/serializers/realtime-database";

export default RealtimeDatabaseSerializer.extend({
    attrs: {
        isOffline: {
            serialize: false,
            deserialize: false,
        },
        users: { embedded: "always" },
        transactions: { embedded: "always" },
    },
});
