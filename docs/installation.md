# Installation

## Requirements

Before installing `express-api-guard`, make sure your project has:

* Node.js 18 or higher
* Express.js 5.x

You can check your Node.js version with:

```bash
node --version
```

## Install the Package

Install `express-api-guard` using npm:

```bash
npm install express-api-guard
```

This installs the package and its required dependencies into your project.

## Import the Middleware

After installation, import the middleware you need:

```js
import {
  requestId,
  rateLimiter,
  securityHeaders,
  ipGuard,
  requestSize,
  securityLogger
} from "express-api-guard";
```

You can import only the middleware you need. For example:

```js
import { requestId, rateLimiter } from "express-api-guard";
```

## Basic Express Setup

Create an Express application and register the middleware:

```js
import express from "express";
import {
  requestId,
  rateLimiter,
  securityHeaders
} from "express-api-guard";

const app = express();

app.use(requestId());

app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 100
  })
);

app.use(securityHeaders());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    requestId: req.requestId
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Using All Middleware

For a more complete security setup:

```js
import express from "express";

import {
  requestId,
  rateLimiter,
  securityHeaders,
  ipGuard,
  requestSize,
  securityLogger
} from "express-api-guard";

const app = express();

app.use(requestId());

app.use(securityLogger());

app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 100
  })
);

app.use(
  ipGuard({
    blockedIPs: ["192.168.1.100"]
  })
);

app.use(
  requestSize({
    limit: 1024 * 1024
  })
);

app.use(securityHeaders());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    requestId: req.requestId
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Middleware Order

A recommended middleware order is:

```text
Request
   ↓
requestId()
   ↓
securityLogger()
   ↓
rateLimiter()
   ↓
ipGuard()
   ↓
requestSize()
   ↓
securityHeaders()
   ↓
express.json()
   ↓
Routes
   ↓
Response
```

This order allows the request to receive an ID early, security events to be observed, and potentially unwanted requests to be rejected before reaching your application routes.

## Verify Installation

After installing the package, start your Express application:

```bash
node server.js
```

You should see:

```text
Server running on port 3000
```

Your API is now using `express-api-guard` for additional request protection.
