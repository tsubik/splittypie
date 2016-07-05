import Ember from "ember";
import DS from "ember-data";

const { service } = Ember.inject;

export default Ember.Mixin.create({
    save() {
        this.set("modifiedAt", new Date());
        return this._super(...arguments);
    },

    destroyRecord() {
        this.set("isDeleted", true);
        return this.save();
    },
});
