import EventForm from "splitr-lite/forms/event";
import UserForm from "splitr-lite/forms/user";
import TransactionForm from "splitr-lite/forms/transaction";

export function initialize(application) {
    application.register("forms:event", EventForm, { instantiate: false });
    application.register("forms:user", UserForm, { instantiate: false });
    application.register("forms:transaction", TransactionForm, { instantiate: false });

    // inject form factory to routes
    application.inject("route", "formFactory", "service:form-factory");
}

export default {
    name: "forms",
    initialize
};
