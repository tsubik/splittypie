import { setupApplicationTest } from 'ember-qunit';

export default function (hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function () {
        const adapter = this.owner.lookup("adapter:offline/application");
        adapter.get("cache").clear();
        window.localStorage.clear();
        window.localforage.clear();
    });

    hooks.afterEach(function () {
        window.localStorage.clear();
        window.localforage.clear();
    });
}
