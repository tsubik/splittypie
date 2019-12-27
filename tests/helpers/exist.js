import { registerHelper } from '@ember/test';

export const exist = function (selector) {
    return !!find(selector).length;
};

export default registerHelper("exist", function (app, selector) {
    return exist(selector);
});
