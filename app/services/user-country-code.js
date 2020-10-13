import { set, get } from "@ember/object";
import Service, { inject as service } from "@ember/service";

export default Service.extend({
    ajax: service(),
    countryCode: null,

    getCountryCode() {
        let countryCode = this.countryCode;

        if (countryCode === null) {
            countryCode = this.ajax
                .request("http://ip-api.com/json")
                .then((data) => data && data.countryCode)
                .catch((e) => {
                    console.error(e);
                });
            set(this, "countryCode", countryCode);
        }

        return countryCode;
    },
});
