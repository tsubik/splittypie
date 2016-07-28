import Base from "ember-validations/validators/base";
import Ember from "ember";

const { isArray, get } = Ember;

export default Base.extend({
    init() {
        // this call is necessary, don't forget it!
        this._super();

        this.dependentValidationKeys.pushObject(`${this.property}.@each.isValid`);
    },

    call() {
        const arrayToValidate = get(this.model, this.property);

        if (!arrayToValidate) {
            return;
        }

        if (!isArray(arrayToValidate)) {
            throw new Error(
                `property ${this.property} is not an array, but array validator is used`
            );
        }

        if (arrayToValidate.isAny("isValid", false)) {
            this.errors.pushObject("not every element valid");
        }
    },
});
