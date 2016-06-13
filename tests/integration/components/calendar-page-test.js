import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import extraTrim from "../../helpers/extra-trim";

moduleForComponent("calendar-page", "Integration | Component | calendar page", {
    integration: true,
});

test("it renders", function (assert) {
    const date = "2015-03-01";

    this.set("date", date);
    this.render(hbs`{{calendar-page date=date}}`);

    assert.equal(extraTrim(this.$().text()), "Mar 01");
});
