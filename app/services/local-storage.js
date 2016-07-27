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
