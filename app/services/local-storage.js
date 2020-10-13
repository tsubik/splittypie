import { warn, assert } from "@ember/debug";
import { computed, get } from "@ember/object";
import Service from "@ember/service";

export default Service.extend({
    isLocalStorageSupported: computed(function () {
        if (localStorage) {
            try {
                localStorage.setItem("localStorageTest", 1);
                localStorage.removeItem("localStorageTest");
                return true;
            } catch (e) {
                warn("Browser does not support localstorage");
            }
        }

        return false;
    }),

    setItem(key, value) {
        if (this.isLocalStorageSupported) {
            localStorage.setItem(key, value);
        }
    },

    getItem(key) {
        if (this.isLocalStorageSupported) {
            return localStorage.getItem(key);
        }

        return null;
    },

    removeItem(key) {
        if (this.isLocalStorageSupported) {
            localStorage.removeItem(key);
        }
    },

    remove(entryName, id) {
        assert("First argument entryName must be present", entryName);

        if (this.isLocalStorageSupported) {
            const items = this.findAll(entryName);

            items.removeObject(items.findBy("id", id));
            localStorage.setItem(entryName, JSON.stringify(items));
        }
    },
});
