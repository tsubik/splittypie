import Ember from "ember";

export default Ember.Service.extend({
    isLocalStorageSupported: function () {
        if (localStorage) {
            try {
                localStorage.setItem("localStorageTest", 1);
                localStorage.removeItem("localStorageTest");
                return true;
            } catch (e) {
                Ember.warn("Browser does not support localstorage");
            }
        }

        return false;
    }.property(),

    setItem(key, value) {
        if (!this.get("isLocalStorageSupported")) {
            return;
        }

        localStorage.setItem(key, value);
    },

    getItem(key) {
        if (!this.get("isLocalStorageSupported")) {
            return null;
        }

        return localStorage.getItem(key);
    },

    removeItem(key) {
        if (!this.get("isLocalStorageSupported")) {
            return;
        }

        localStorage.removeItem(key);
    },

    push(entryName, item) {
        Ember.assert("First argument entryName must be present", entryName);
        Ember.assert("Pushed item must have id property", item.id);

        if (!this.get("isLocalStorageSupported")) {
            return;
        }

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

    find(entryName, id) {
        return this.findAll(entryName).findBy("id", id);
    },

    _findAll(entryName) {
        if (!this.get("isLocalStorageSupported")) {
            return [];
        }

        const itemsString = localStorage.getItem(entryName);

        return !!itemsString ? JSON.parse(itemsString) : [];
    },

    remove(entryName, id) {
        Ember.assert("First argument entryName must be present", entryName);

        if (!this.get("isLocalStorageSupported")) {
            return;
        }

        const items = this.findAll(entryName);

        items.removeObject(items.findBy("id", id));
        localStorage.setItem(entryName, JSON.stringify(items));
    },
});
