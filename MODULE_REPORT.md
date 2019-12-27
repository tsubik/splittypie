## Module Report
### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/initializers/offline-support.js` at line 4

```js
import Ember from "ember";

const { Logger: { error, debug } } = Ember;

export default {
```

### Unknown Global

**Global**: `Ember.Logger.error`

**Location**: `app/initializers/offline-support.js` at line 4

```js
import Ember from "ember";

const { Logger: { error, debug } } = Ember;

export default {
```

### Unknown Global

**Global**: `Ember.onerror`

**Location**: `app/initializers/rollbar.js` at line 37

```js

    syncQueue.on("error", reportError);
    Ember.onerror = reportError;
    window.onerror = reportError;
    RSVP.on("error", reportError);
```

### Unknown Global

**Global**: `Ember.K`

**Location**: `app/components/my-checkbox-list.js` at line 6

```js
    get,
    set,
    K,
    Component,
} = Ember;
```

### Unknown Global

**Global**: `Ember.K`

**Location**: `app/components/my-select.js` at line 8

```js
    on,
    observer,
    K,
    Component,
} = Ember;
```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/connection.js` at line 5

```js
const {
    computed: { equal },
    Logger: { debug },
    set,
    Service,
```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/job-processor.js` at line 7

```js
    get,
    inject: { service },
    Logger: { debug },
    Service,
} = Ember;
```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/sync-queue.js` at line 5

```js
const {
    inject: { service },
    Logger: { debug },
    RSVP: { Promise },
    get,
```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/syncer.js` at line 5

```js
const {
    inject: { service },
    Logger: { debug },
    computed: { alias },
    run: { scheduleOnce },
```

### Unknown Global

**Global**: `Ember.Logger.error`

**Location**: `app/services/user-country-code.js` at line 5

```js
const {
    inject: { service },
    Logger: { error },
    get,
    set,
```

### Unknown Global

**Global**: `Ember.Test.promise`

**Location**: `tests/helpers/run-and-wait-for-sync-queue-to-flush.js` at line 3

```js
import Ember from "ember";

const { promise, registerAsyncHelper } = Ember.Test;

export default registerAsyncHelper("runAndWaitForSyncQueueToFlush", function (app, action) {
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/run-and-wait-for-sync-queue-to-flush.js` at line 3

```js
import Ember from "ember";

const { promise, registerAsyncHelper } = Ember.Test;

export default registerAsyncHelper("runAndWaitForSyncQueueToFlush", function (app, action) {
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/wait-for-promise.js` at line 4

```js

export default Ember.Test.registerAsyncHelper("waitForPromise", function (app, promise) {
    return Ember.Test.promise((resolve) => {
        Ember.Test.adapter.asyncStart();
        promise().then((value) => {
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/wait-for-promise.js` at line 5

```js
export default Ember.Test.registerAsyncHelper("waitForPromise", function (app, promise) {
    return Ember.Test.promise((resolve) => {
        Ember.Test.adapter.asyncStart();
        promise().then((value) => {
            resolve(value);
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/wait-for-promise.js` at line 8

```js
        promise().then((value) => {
            resolve(value);
            Ember.Test.adapter.asyncEnd();
        });
    });
```
