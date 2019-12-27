import { set, get } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import Ember from "ember";

const {
    Logger: { error }
} = Ember;

export default Service.extend({
    ajax: service(),
    countryCode: null,

    getCountryCode() {
        let countryCode = get(this, "countryCode");

        if (countryCode === null) {
            countryCode = get(this, "ajax")
                .request("https://geoip.nekudo.com/api")
                .then((data) => {
                    if (data.country && data.country.code) {
                        return data.country.code;
                    }

                    return undefined;
                })
                .catch((e) => {
                    error(e);
                });
            set(this, "countryCode", countryCode);
        }

        return countryCode;
    },
});
