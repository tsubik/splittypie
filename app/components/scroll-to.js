import $ from "jquery";
import { schedule } from "@ember/runloop";
import { get, computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
    tagName: "li",
    classNames: ["scroll-to"],

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
        this._onWindowScroll = this._determineIfActive.bind(this);
        $(window).on("scroll", this._onWindowScroll);

        schedule("afterRender", () => {
            this._determineIfActive();
        });
    },

    willDestroyElement() {
        this._super(...arguments);
        $(window).off("scroll", this._onWindowScroll);
    },

    _determineIfActive() {
        const referenceElement = get(this, "referenceElement");
        const offset = get(this, "offset");
        const scrollTop = $(window).scrollTop();
        const elementTop = Math.floor(referenceElement.offset().top);

        if (scrollTop + offset >= elementTop) {
            $(".scroll-to").removeClass("active");
            this.$().addClass("active");
        }
    },
});
