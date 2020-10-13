## Module Report
### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/instance-initializers/offline-support.js` at line 4

```js
import Ember from "ember";

const { Logger: { error, debug } } = Ember;

export default {
```

### Unknown Global

**Global**: `Ember.Logger.error`

**Location**: `app/instance-initializers/offline-support.js` at line 4

```js
import Ember from "ember";

const { Logger: { error, debug } } = Ember;

export default {
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/instance-initializers/rollbar.js` at line 20

```js

function reportError(error) {
    if (Ember.testing) {
        throw error;
    }
```

### Unknown Global

**Global**: `Ember.onerror`

**Location**: `app/instance-initializers/rollbar.js` at line 43

```js

    syncQueue.on("error", reportError);
    Ember.onerror = reportError;
    window.onerror = reportError;
    RSVP.on("error", reportError);
```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/connection.js` at line 7

```js

const {
    Logger: { debug }
} = Ember;

```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/job-processor.js` at line 7

```js

const {
    Logger: { debug }
} = Ember;

```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/sync-queue.js` at line 8

```js

const {
    Logger: { debug }
} = Ember;

```

### Unknown Global

**Global**: `Ember.Logger.debug`

**Location**: `app/services/syncer.js` at line 15

```js

const {
    Logger: { debug }
} = Ember;

```

### Unknown Global

**Global**: `Ember.Logger.error`

**Location**: `app/services/user-country-code.js` at line 6

```js

const {
    Logger: { error }
} = Ember;

```

### Unknown Global

**Global**: `Ember.Test.promise`

**Location**: `tests/helpers/run-and-wait-for-sync-queue-to-flush.js` at line 4

```js

const {
    promise
} = Ember.Test;

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/run-and-wait-for-sync-queue-to-flush.js` at line 5

```js
const {
    promise
} = Ember.Test;

export default function (action) {
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/wait-for-promise.js` at line 5

```js

registerAsyncHelper("waitForPromise", function (app, promise) {
    return Ember.Test.promise((resolve) => {
        Ember.Test.adapter.asyncStart();
        promise().then((value) => {
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/wait-for-promise.js` at line 6

```js
registerAsyncHelper("waitForPromise", function (app, promise) {
    return Ember.Test.promise((resolve) => {
        Ember.Test.adapter.asyncStart();
        promise().then((value) => {
            resolve(value);
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/wait-for-promise.js` at line 9

```js
        promise().then((value) => {
            resolve(value);
            Ember.Test.adapter.asyncEnd();
        });
    });
```
