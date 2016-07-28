import DS from "ember-data";
import LFSerializer from "ember-localforage-adapter/serializers/localforage";

const { EmbeddedRecordsMixin } = DS;

export default LFSerializer.extend(
    EmbeddedRecordsMixin, {
        attrs: {
            users: { embedded: "always" },
            transactions: { embedded: "always" },
        },
    }
);
