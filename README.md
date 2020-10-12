# xstate-state-tracker

Small [xstate](https://xstate.js.org) utility to log all state transitions to a specified callback function. Tracks child machines started via `invoke` too, to any depth.

## Usage

Install the package

```
> npm install xstate-state-tracker --save-dev
```

Include it in your codebase

```js
import tracker from "xstate-state-tracker";
```

Pass it an xstate interpreter instance to track

```js
import { Machine, interpret } from "xstate";
import tracker from "xstate-state-tracker";

const statechart = Machine({
    initial : "one",

    states : {
        one : {},
    },
});

const service = interpret(statechart);

// Callback function will be invoked with a machine path as well as the current machine state object
const track = tracker((id, value) => console.log(`${id} :: ${JSON.stringify(value)}`));

// Track the interpreter instance and respond on all changes
track(service);
```
