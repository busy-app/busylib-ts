# busylib

[![node version](https://img.shields.io/node/v/%40busy-app%2Fbusy-lib?color=66cc33&style=flat)](https://nodejs.org) [![license](https://img.shields.io/npm/l/@busy-app/busy-lib?color=2B7FFF&style=flat)](./LICENSE)

A TypeScript library for interacting with the [BUSY Bar](https://busy.app/) - a productivity multi-tool with an LED pixel screen for custom statuses, built-in Pomodoro timer, and apps.

The library currently features three modules:

- **`BusyBar`** - a typed client for the BUSY Bar [HTTP API](https://docs.busy.app/bar/dev/http-api)
- **`StateStream`** - real-time BUSY Bar state updates over WebSocket
- **`ScreenRenderer`** - WebGL2 BUSY Bar display renderer

Supports both ESM (import) and CommonJS (require), with full TypeScript type definitions.

## Table of contents

- [Install](#install)
- [BUSY Bar HTTP API](#busy-bar-http-api)
- [StateStream](#statestream---real-time-device-state-updates)
- [ScreenRenderer](#screenrenderer---rendering-busy-bar-display)
- [Links](#links)
- [License](#license)

## Install

```bash
npm i @busy-app/busy-lib
```

---

## BUSY Bar HTTP API

`BusyBar` is a single class that talks to the BUSY Bar over HTTP - a typed wrapper around the [HTTP API](https://docs.busy.app/bar/dev/http-api). It aggregates every namespace - `System*`, `Display*`, `Audio*`, `Wifi*`, `Storage*`, `Settings*`, `Ble*`, `Input*`, `SmartHome*`, `Account*`, `Assets*`, `Time*`, `Update*` - so everything can be called from one instance. All methods are async and return typed results.

### Quick start

```ts
import { BusyBar } from '@busy-app/busy-lib';

const bar = new BusyBar({
  addr: '10.0.4.20' // the BUSY Bar's IP address
});

const status = await bar.SystemStatusGet();
```

Since every call is a network request to a physical device, any method may reject. What you catch depends on the error:

- **HTTP error** (4xx/5xx) - a custom error with `status`, `statusText`, and the
  parsed `body` attached, plus a human-readable `message`
- **Timeout** - a `DOMException` with `name === 'TimeoutError'` (the default
  timeout is 3000ms; see [Request options](#request-options))
- **Aborted via `signal`** - a `DOMException` with `name === 'AbortError'` (if `AbortController` is passed and request is aborted)
- **Unreachable device / network failure** - the native `fetch` error (e.g. `TypeError: Failed to fetch`)

### Request options

Methods that take an API payload accept it as the first argument, followed by an optional `options` object; methods without a payload take `options` as their only argument. Common options include `timeout` and `signal` for request cancellation (both optional):

```ts
const controller = new AbortController();

try {
  await bar.SettingsNameSet(
    {
      name: 'My BUSY Bar' // the API payload
    },
    {
      timeout: 1000, // ms; overrides the client default (3000)
      signal: controller.signal // cancel the request via AbortController
    }
  );
} catch (err) {
  // rejects with a TimeoutError or AbortError when the request is cut short
  console.error(err);
}
```

You can also set a default `timeout` for all requests in the class constructor:

```ts
const bar = new BusyBar({
  timeout: 5000
});
```

### Connection options

The `addr` you pass decides how the client connects. It accepts an IP address, a domain, or a full URL.

```ts
new BusyBar(); // defaults to http://10.0.4.20

new BusyBar({
  addr: '10.0.4.20' // or http://192.168.13.37, https://example.com, etc.
});

new BusyBar({
  addr: 'https://api.busy.app',
  token: '<bearer-token>' // API token required for the BUSY proxy, see Authentication section
});
```

### Authentication

You can set up remote proxy access to send requests to your BUSY Bar from anywhere in the world. This requires an API token, issued at https://cloud.busy.app/api-tokens. You can provide it in the constructor or at runtime with `setToken`:

```ts
const bar = new BusyBar({
  addr: 'https://api.busy.app',
  token: '<token>'
});
bar.setToken('<new-token>'); // change at runtime
```

For local network access, the BUSY Bar can optionally require an HTTP access password. Configure it in the web UI over USB-Ethernet (`10.0.4.20`) under Settings → HTTP Access. Provide the password in the constructor or at runtime with `setHTTPAccessPassword`:

```ts
const bar = new BusyBar({
  addr: '192.168.13.37',
  HTTPAccessPassword: '<password>'
});
bar.setHTTPAccessPassword('<new-password>'); // change at runtime
```

### Pitfalls

- **Protocol is auto-added.** `addr` defaults to `http://`, except the BUSY proxy host, which defaults to `https://`. Specify the protocol explicitly to override

---

## StateStream - real-time device state updates

`StateStream` receives the BUSY Bar's protobuf-encoded state updates over WebSocket. It runs in a Shared Worker to avoid overloading the BUSY Bar with multiple connections from multiple tabs.

`StateStream` decodes protobuf for you, so you get ready-to-use typed objects in your callbacks.
The worker is bundled inline; no bundler configuration is required on your side.

### Quick start

```ts
import { LocalStateStream } from '@busy-app/busy-lib';

const stream = new LocalStateStream({
  addr: '10.0.4.20'
  // use HTTPAccessPassword: '<password>' for local network access with HTTP password enabled
});

try {
  await stream.start({
    dataCallback: (state) => {
      // state.updates is an array; each update carries a `state` key
      // for the module that changed (e.g. 'audio', 'wifi', 'brightness')
      for (const update of state.updates ?? []) {
        console.log(update.state, update);
      }
    },
    statusCallback: (status) => {
      console.log(status);
    },
    errorCallback: (err) => {
      // typed lifecycle errors from the worker, websocket or protobuf decoder
      console.error(err);
    }
  });
} catch (err) {
  // start() rejects on the error during initial connection/authorization, or on timeout
  console.error(err);
}

// close the connection and clean up callbacks;
// the worker remains alive, so you can start again
try {
  await stream.stop();
} catch (err) {
  // stop() rejects only if websocket failed to close gracefully. Worker is not terminated
  console.error(err);
}
```

### Tuning reconnection & timeouts

Pass a config object as the second constructor argument:

```ts
new LocalStateStream(
  {
    addr: '10.0.4.20'
  },
  {
    timeout: 5000, // connection timeout (ms)
    dataTimeout: 15000, // how long to wait before marking the stream as STALE when no data is received (ms)
    maxReconnectAttempts: 5,
    reconnectDelay: 1000, // delay between reconnect attempts (ms)
    workerName: 'my-worker' // override the shared-worker key
  }
);
```

### Error handling

`errorCallback` always receives a `StateStreamError` carrying a machine-readable `code` from `StateStreamErrorCode`:

```ts
import { StateStreamErrorCode } from '@busy-app/busy-lib';

errorCallback: (err) => {
  if (err.code === StateStreamErrorCode.CONNECTION_TIMEOUT) {
    retryLater();
  } else if (err.code === StateStreamErrorCode.AUTH_FAILED) {
    promptLogin();
  }
};
```

### Pitfalls

- **Browser only.** `StateStream` is designed for the browser and relies on `SharedWorker` with fallback to Web Workers. Node implementation on Worker Threads is possible but not currently planned
- **`STALE` ≠ websocket closed.** A live connection that simply stops sending messages flips `status.data` to `STALE` after `dataTimeout` - the websocket is still up, even if the device is no longer responding
- **Don't double-start.** If the stream is already starting or running, `start()` rejects with `STREAM_ALREADY_STARTED`. Call `stop()` first
- **Stop vs Destroy.** `stop()` closes the websocket gracefully and clears callbacks; `destroy()` does the same and also terminates the worker

---

## ScreenRenderer - rendering BUSY Bar display

`ScreenRenderer` paints a display frame onto a `<canvas>` using WebGL2, with a rounded-pixel LED look (customizable). It's a singleton - importing `ScreenRenderer` always gives the same instance, and the WebGL context is created lazily on first use.

> This module currently targets the **front** display only - frames are `72 × 16` pixels. You can use the `getDisplayDimensions(Display.FRONT)` helper to get those dimensions.

`renderFrame` always expects RGBA bytes. How you get to RGBA depends on where the
frame comes from:

- **From a live `StateStream`** - already RGBA. The worker decodes and converts each frame for you, so you render it directly
- **From an HTTP `DisplayScreenFrameGet`** - defaults to BGR; set the optional `format` to `'rgba'`

The renderer knows nothing about the device - it just draws a pixel grid. Any `Uint8Array` / `Uint8ClampedArray` of `width × height × 4` bytes works, whether it came from the device, a file, or one you built yourself:

```ts
// a 2×1 grid: one red pixel, one green pixel
const data = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255]);
ScreenRenderer.renderFrame(Display.FRONT, { canvas, data, width: 2, height: 1 });
```

### Quick start with StateStream

State updates can carry a `frame`, and its `data` is **already RGBA** - the worker decompresses and converts each frame for use in `renderFrame`:

```ts
import {
  LocalStateStream,
  ScreenRenderer,
  Display,
  getDisplayDimensions
} from '@busy-app/busy-lib';

const stream = new LocalStateStream({
  addr: '10.0.4.20'
});
const canvas = document.querySelector('canvas');
const { width, height } = getDisplayDimensions(Display.FRONT);

try {
  await stream.start({
    dataCallback: (state) => {
      for (const update of state.updates ?? []) {
        if (canvas && update.frame?.data) {
          ScreenRenderer.renderFrame(Display.FRONT, { canvas, data: update.frame.data, width, height });
        }
      }
    }
  });
} catch (err) {
  console.error(err);
}
```

### Render options

`renderFrame` takes an optional config argument to tune the look:

```ts
ScreenRenderer.renderFrame(Display.FRONT, { canvas, data: rgba, width, height }, {
  pixelSize: 0.85, // 0–1, size of each cell within its grid slot
  radius: 0.5, // 0–1, corner radius of each pixel
  darkThreshold: 0.04 // pixels darker than this are rendered transparent
});
```

### Pitfalls

- **Browser only.** `ScreenRenderer` needs `window` and a WebGL2 context
- **`data` length must match `width × height × 4`.** The bytes are uploaded straight to a WebGL texture as RGBA, so the buffer must hold exactly four bytes per pixel for the `width` and `height` you pass. A mismatch makes WebGL throw synchronously from `renderFrame`

---

## Links
- Documentation: https://docs.busy.app/bar/dev/libraries
- Source: https://github.com/busy-app/busylib-ts
- npm: https://www.npmjs.com/package/@busy-app/busy-lib

---

## License

[MIT](./LICENSE)
