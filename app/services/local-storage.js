import Ember from "ember";

export default Ember.Service.extend({
    push(entryName, item) {
        Ember.assert("First argument entryName must be present", entryName);
        Ember.assert("Pushed item must have id property", item.id);

        const items = this.findAll(entryName);
        const itemToUpdate = items.findBy("id", item.id);

        if (itemToUpdate) {
            itemToUpdate.setProperties(item);
        } else {
            items.pushObject(item);
        }

        localStorage.setItem(entryName, JSON.stringify(items));
    },

    findAll(entryName) {
        const items = this._findAll(entryName).map((item) => Ember.Object.create(item));
        const snapshot = this.getWithDefault(entryName, []);

        snapshot.clear();
        snapshot.pushObjects(items);
        this.set(entryName, snapshot);

        return snapshot;
    },

    _findAll(entryName) {
        const itemsString = localStorage.getItem(entryName);

        return !!itemsString ? JSON.parse(itemsString) : [];
    },

    remove(entryName, id) {
        Ember.assert("First argument entryName must be present", entryName);

        const items = this.findAll(entryName);

        items.removeObject(items.findBy("id", id));
        localStorage.setItem(entryName, JSON.stringify(items));
    },
});
