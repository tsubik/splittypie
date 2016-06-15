import Ember from "ember";

export default Ember.Component.extend({
    tagName: "li",
    classNameBindings: ["active"],

    href: null,
    duration: 700,
    easing: "swing",
    offset: 200,
    label: null,

    referenceElement: Ember.computed("href", function () {
        const href = this.get("href");

        return Ember.$(href);
    }),

    click(event) {
        event.stopPropagation();
        event.preventDefault();

        const referenceElement = this.get("referenceElement");
        const offset = this.get("offset");
        const duration = this.get("duration");
        const easing = this.get("easing");

        Ember.$("html, body").animate({
            scrollTop: referenceElement.offset().top - offset,
        }, duration, easing);
    },

    didInsertElement() {
        this._super(...arguments);
        Ember.$(window).on("scroll", this.checkPosition.bind(this));

        Ember.run.schedule("afterRender", () => {
            this.checkPosition();
        });
    },

    willDestroyElement() {
        this._super(...arguments);
    },

    checkPosition() {
        const referenceElement = this.get("referenceElement");
        const offset = this.get("offset") + 100; // FIXME: fix this value
        const position = Ember.$(window).scrollTop();
        const top = referenceElement.offset().top - offset;
        const bottom = top + referenceElement.outerHeight();

        if (position >= top && position <= bottom) {
            this.set("active", true);
        } else {
            this.set("active", false);
        }
    },
});
