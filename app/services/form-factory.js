import Ember from "ember";

const {
    getOwner,
    merge,
    Service,
} = Ember;

export default Service.extend({
    createForm(name, model, properties) {
        const owner = getOwner(this);
        const formFactory = owner.lookup(`forms:${name}`);

        if (!formFactory) {
            throw new Error(`There is no factory for ${name} form registered in application`);
        }

        return formFactory.create(
            merge({ model, formType: name }, owner.ownerInjection(), properties)
        );
    },
});
