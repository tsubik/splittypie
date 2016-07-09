import EventForm from "splittypie/forms/event";
import UserForm from "splittypie/forms/user";
import ExpenseForm from "splittypie/forms/expense";
import TransferForm from "splittypie/forms/transfer";

export function initialize(application) {
    application.register("forms:event", EventForm, { instantiate: false });
    application.register("forms:user", UserForm, { instantiate: false });
    application.register("forms:expense", ExpenseForm, { instantiate: false });
    application.register("forms:transfer", TransferForm, { instantiate: false });

    // inject form factory to routes
    application.inject("route", "formFactory", "service:form-factory");
}

export default {
    name: "forms",
    initialize,
};
