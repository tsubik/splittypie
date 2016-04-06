import Ember from "ember";

export default Ember.Service.extend({
    ajax: Ember.inject.service(),
    countryCode: null,

    getCountryCode() {
        let countryCode = this.get("countryCode");

        if (countryCode === null) {
            countryCode = this.get("ajax")
                .request("https://geoip.nekudo.com/api")
                .then((data) => {
                    if (data.country && data.country.code) {
                        return data.country.code;
                    }

                    return undefined;
                })
                .catch((error) => {
                    Ember.Logger.error(error);
                });
            this.set("countryCode", countryCode);
        }

        return countryCode;
    },
});
