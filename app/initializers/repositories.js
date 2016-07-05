import EventRepository from "splittypie/repositories/event";
import TransactionRepository from "splittypie/repositories/transaction";

export function initialize(application) {
    application.register("service:event-repository", EventRepository);
    application.register("service:transaction-repository", TransactionRepository);
}

export default {
    name: "repositories",
    initialize,
};
