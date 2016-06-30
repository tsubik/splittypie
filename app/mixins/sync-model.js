import Ember from "ember";
import DS from "ember-data";

export default Ember.Mixin.create({
    modifiedAt: DS.attr("date"),
    isDeleted: DS.attr("boolean"),

    save() {
        this.set("modifiedAt", new Date());
        return this._super(...arguments);
    },

    destroyRecord() {
        this.set("isDeleted", true);
        return this.save();
    },
});
