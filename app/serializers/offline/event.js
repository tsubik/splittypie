import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import LFSerializer from "ember-localforage-adapter/serializers/localforage";

export default LFSerializer.extend(
    EmbeddedRecordsMixin, {
        attrs: {
            users: { embedded: "always" },
            transactions: { embedded: "always" },
        },
    }
);
