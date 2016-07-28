import Ember from "ember";

const {
    $,
    run: { schedule },
    computed,
    get,
    set,
    Component,
} = Ember;

export default Component.extend({
    tagName: "li",
    classNameBindings: ["active"],

    href: null,
    duration: 700,
    easing: "swing",
    offset: 200,
    label: null,

    referenceElement: computed("href", function () {
        const href = get(this, "href");

        return $(href);
    }),

    click(event) {
        event.stopPropagation();
        event.preventDefault();

        const referenceElement = get(this, "referenceElement");
        const offset = get(this, "offset");
        const duration = get(this, "duration");
        const easing = get(this, "easing");

        $("html, body").animate({
            scrollTop: referenceElement.offset().top - offset,
        }, duration, easing);
    },

    didInsertElement() {
        this._super(...arguments);
        $(window).on("scroll", this.checkPosition.bind(this));

        schedule("afterRender", () => {
            this.checkPosition();
        });
    },

    willDestroyElement() {
        this._super(...arguments);
    },

    checkPosition() {
        const referenceElement = get(this, "referenceElement");
        const offset = get(this, "offset") + 100; // FIXME: fix this value
        const position = $(window).scrollTop();
        const top = referenceElement.offset().top - offset;
        const bottom = top + referenceElement.outerHeight();

        if (position >= top && position <= bottom) {
            set(this, "active", true);
        } else {
            set(this, "active", false);
        }
    },
});
