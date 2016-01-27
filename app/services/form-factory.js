import Ember from "ember";

export default Ember.Service.extend({
    createForm(name, model, properties) {
        const formFactory = this.get("container").lookup(`forms:${name}`);

        if (!formFactory) {
            throw new Error(`There is no factory for ${name} form registered in application`);
        }

        return formFactory.create(Ember.merge({ model }, properties));
    },
});
