import { getOwner } from "@ember/application";
import Service from "@ember/service";

export default Service.extend({
    createForm(name, model, properties) {
        const owner = getOwner(this);
        const formFactory = owner.lookup(`forms:${name}`);

        if (!formFactory) {
            throw new Error(`There is no factory for ${name} form registered in application`);
        }

        return formFactory.create({
            model,
            formType: name,
            ...owner.ownerInjection(),
            ...properties
        });
    },
});
