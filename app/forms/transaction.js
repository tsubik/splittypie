import Ember from "ember";
import Form from "splitr-lite/mixins/form";

export default Ember.Object.extend(Form, {
    validations: {
        name: {
            presence: true,
            length: { maximum: 50 }
        },
        amount: {
            presence: true,
            numericality: true
        },
        payer: {
            presence: true
        },
        participants: {
            presence: true
        }
    },

    name: Ember.computed.oneWay("model.name"),
    amount: Ember.computed.oneWay("model.amount"),
    payer: Ember.computed.oneWay("model.payer"),
    event: Ember.computed.oneWay("model.event"),

    initParticipants: Ember.on("init", function () {
        this.set("participants", this.get("model.participants").toArray());
    }),

    updateModelAttributes() {
        const model = this.get("model");

        model.setProperties(this.getProperties("name", "amount", "payer"));
        model.set("participants", this.get("participants"));
    }
});
