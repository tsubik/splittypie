import DS from "ember-data";
import LFSerializer from "ember-localforage-adapter/serializers/localforage";

export default LFSerializer.extend(
    DS.EmbeddedRecordsMixin, {
        attrs: {
            users: { embedded: "always" },
            transactions: { embedded: "always" },
        },
    }
);
