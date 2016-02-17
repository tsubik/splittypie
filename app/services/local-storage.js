import Ember from "ember";

export default Ember.Service.extend(Ember.Evented, {
    push(typeName, item) {
        Ember.assert("First argument typeName must be present", typeName);
        Ember.assert("Pushed item must have id property", item.id);

        const items = this.findAll(typeName);
        const itemToUpdate = items.findBy("id", item.id);

        if (itemToUpdate) {
            Object.assign(itemToUpdate, this._toJSON(item));
        } else {
            items.pushObject(item);
        }

        localStorage.setItem(typeName, JSON.stringify(items));
        this.trigger("changed");
    },

    findAll(typeName) {
        const itemsString = localStorage.getItem(typeName);

        return !!itemsString ? JSON.parse(itemsString) : [];
    },

    _toJSON(object) {
        return JSON.parse(JSON.stringify(object));
    },
});
