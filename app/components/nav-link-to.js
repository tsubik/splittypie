import Ember from "ember";

const { LinkComponent } = Ember;

export default LinkComponent.extend({
    tagName: "li",
    ariaRole: "presentation",
});
