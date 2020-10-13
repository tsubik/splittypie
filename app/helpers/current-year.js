import Helper from "@ember/component/helper";

export function currentYear() {
    return new Date().getFullYear();
}

export default Helper.helper(currentYear);
