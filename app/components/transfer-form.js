import { alias } from "@ember/object/computed";
import BaseForm from "splittypie/components/base-form";

export default BaseForm.extend({
    formObject: alias("transfer"),
});
