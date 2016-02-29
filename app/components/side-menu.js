import Ember from "ember";

export default Ember.Component.extend({
    sideMenu: Ember.inject.service(),

    progress: Ember.computed.alias("sideMenu.progress"),
    isOpen: Ember.computed.alias("sideMenu.isOpen"),
    isClosed: Ember.computed.alias("sideMenu.isClosed"),

    attributeBindings: ["style"],
    classNames: ["side-menu"],

    disableScroll: Ember.on("init", Ember.observer("isClosed", function () {
        const isClosed = this.get("isClosed");
        const wasClosed = this.get("wasClosed");
        const rootNode = this.get("rootNode");

        if (isClosed === wasClosed) {
            return;
        }

        if (isClosed) {
            Ember.$(rootNode).removeClass("disable-scroll");
        } else {
            Ember.$(rootNode).addClass("disable-scroll");
        }

        this.set("wasClosed", isClosed);
    })),

    style: Ember.computed("progress", function () {
        const progress = this.get("progress");
        const transition = (progress === 0 || progress === 100)
                  ? "transform 0.2s ease-out"
                  : "none";

        return new Ember.Handlebars.SafeString(
            `transform: translateX(${progress}%); transition: ${transition}`
        );
    }),

    didInsertElement() {
        this._super(...arguments);
        this.setupEventListeners();
    },

    willDestroyElement() {
        this._super(...arguments);
        this.removeEventListeners();
    },

    setupEventListeners() {
        const rootNode = document.querySelector("body");
        const onTouchStart = Ember.run.bind(this, this.rootNodeTouch);

        this.set("rootNode", rootNode);
        this.set("onTouchStart", onTouchStart);
        rootNode.addEventListener("touchstart", onTouchStart);
    },

    removeEventListeners() {
        const onTouchStart = this.get("onTouchStart");
        const rootNode = this.get("rootNode");

        rootNode.removeEventListener("touchstart", onTouchStart);
    },

    rootNodeTouch() {
        const isOpen = this.get("isOpen");
        const pageX = event.touches[0].pageX;
        const rootNode = this.get("rootNode");
        const onTouchMove = (event) => {
            event.preventDefault();
            this.updateProgress(event.touches[0].pageX);
        };
        const throttledOnTouchMove = (event) => {
            Ember.run.throttle(this, onTouchMove, event, 10);
        };

        const onTouchEnd = Ember.run.bind(this, (event) => {
            rootNode.removeEventListener("touchmove", throttledOnTouchMove);
            rootNode.removeEventListener("touchend", onTouchEnd);

            this.completeMenuTransition(event);
        });

        if (this.mustTrack(event)) {
            this.set("touchStartEvent", event);
            if (isOpen) {
                this.set("offset", Math.max(0, this.element.offsetWidth - pageX));
            } else {
                this.set("offset", 0);
            }

            rootNode.addEventListener("touchmove", throttledOnTouchMove);
            rootNode.addEventListener("touchend", onTouchEnd);
        }
    },

    updateProgress(touchPageX) {
        const elementWidth = this.element.offsetWidth;
        const offset = this.get("offset");
        const progress = Math.min((touchPageX + offset) / elementWidth * 100, 100);

        this.set("progress", progress);
    },

    completeMenuTransition(event) {
        const progress = this.get("progress");
        const touchStartEvent = this.get("touchStartEvent");
        const velocityX = this.calculateVelocityX(
            touchStartEvent.touches[0].pageX,
            touchStartEvent.timeStamp,
            event.changedTouches[0].pageX,
            event.timeStamp
        );
        const swipeLeft = velocityX > 0.3;
        const swipeRight = velocityX < -0.3;

        if (!swipeRight && (swipeLeft || progress < 50)) {
            this.get("sideMenu").hide();
        } else if (!swipeLeft && (progress >= 50 || swipeRight)) {
            this.get("sideMenu").show();
        }
    },

    mustTrack(event) {
        return this.get("isOpen") || event.touches[0].pageX < 40;
    },

    calculateVelocityX(startX, startTimeStamp, endX, endTimeStamp) {
        const deltaX = startX - endX;
        const deltaTime = endTimeStamp - startTimeStamp;

        return deltaX / deltaTime;
    },
});
