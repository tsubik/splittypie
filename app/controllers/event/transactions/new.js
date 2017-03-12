import Ember from "ember";

const { Controller } = Ember;

export default Controller.extend({
    queryParams: ["type", "amount", "name", "date", "from", "to"],
});
