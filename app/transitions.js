export default function () {
    this.transition(
        this.fromRoute("event.index"),
        this.toRoute("event.transactions"),
        this.use("toLeft"),
        this.reverse("toRight")
    );
}
