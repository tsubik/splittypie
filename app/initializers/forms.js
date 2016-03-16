import EventForm from "splittypie/forms/event";
import UserForm from "splittypie/forms/user";
import TransactionForm from "splittypie/forms/transaction";

export function initialize(application) {
    application.register("forms:event", EventForm, { instantiate: false });
    application.register("forms:user", UserForm, { instantiate: false });
    application.register("forms:transaction", TransactionForm, { instantiate: false });

    // inject form factory to routes
    application.inject("route", "formFactory", "service:form-factory");
}

export default {
    name: "forms",
    initialize,
};
