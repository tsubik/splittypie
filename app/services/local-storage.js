import Ember from "ember";

export default Ember.Service.extend(Ember.Evented, {
    push(entryName, item) {
        Ember.assert("First argument entryName must be present", entryName);
        Ember.assert("Pushed item must have id property", item.id);

        const items = this.findAll(entryName);
        const itemToUpdate = items.findBy("id", item.id);

        if (itemToUpdate) {
            Object.assign(itemToUpdate, this._toJSON(item));
        } else {
            items.pushObject(item);
        }

        localStorage.setItem(entryName, JSON.stringify(items));
        this.trigger("changed");
    },

    findAll(entryName) {
        const itemsString = localStorage.getItem(entryName);

        return !!itemsString ? JSON.parse(itemsString) : [];
    },

    remove(entryName, id) {
        Ember.assert("First argument entryName must be present", entryName);

        const items = this.findAll(entryName).rejectBy("id", id);

        localStorage.setItem(entryName, JSON.stringify(items));
        this.trigger("changed");
    },

    _toJSON(object) {
        return JSON.parse(JSON.stringify(object));
    },
});
