# Usage

`express-api-guard` provides several middleware functions that can be added individually or combined to protect an Express.js API.

## Import

Import the middleware you need from the package:

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

---

## 1. Request ID

The `requestId()` middleware generates a unique ID for every incoming request.

### Usage

```js
app.use(requestId());
```

The generated request ID is available through:

```js
req.requestId
```

It is also returned to the client through the:

```text
X-Request-ID
```

response header.

### Example

```js
app.get("/", (req, res) => {
  res.json({
    message: "Request received",
    requestId: req.requestId
  });
});
```

---

## 2. Rate Limiter

The `rateLimiter()` middleware limits the number of requests that an IP address can make within a specified time window.

### Basic Usage

```js
app.use(rateLimiter());
```

By default:

* Maximum requests: `100`
* Time window: `60 seconds`

### Custom Configuration

```js
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 100
  })
);
```

### Options

| Option     | Type   | Default | Description                                       |
| ---------- | ------ | ------: | ------------------------------------------------- |
| `windowMs` | Number | `60000` | Duration of the rate-limit window in milliseconds |
| `max`      | Number |   `100` | Maximum requests allowed within the window        |

### Example: Strict Rate Limit

```js
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 10
  })
);
```

This allows a maximum of 10 requests per IP address every 60 seconds.

### Response When Limit Is Exceeded

When the request limit is exceeded, the middleware returns:

```http
429 Too Many Requests
```

with:

```json
{
  "error": "Too many requests"
}
```

---

## 3. Security Headers

The `securityHeaders()` middleware adds commonly used HTTP security headers to responses.

### Usage

```js
app.use(securityHeaders());
```

The middleware currently adds:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```

### X-Content-Type-Options

```text
X-Content-Type-Options: nosniff
```

Prevents browsers from attempting to interpret a response as a different MIME type than the one declared by the server.

### X-Frame-Options

```text
X-Frame-Options: DENY
```

Prevents the application from being embedded in a frame.

### Referrer-Policy

```text
Referrer-Policy: no-referrer
```

Prevents the browser from sending the URL of the previous page as referrer information.

---

## 4. IP Guard

The `ipGuard()` middleware allows you to block specific IP addresses or restrict access to an allowlist.

### Block Specific IP Addresses

```js
app.use(
  ipGuard({
    blockedIPs: ["192.168.1.100"]
  })
);
```

Multiple IP addresses can be blocked:

```js
app.use(
  ipGuard({
    blockedIPs: [
      "192.168.1.100",
      "192.168.1.101",
      "10.0.0.50"
    ]
  })
);
```

### Allow Specific IP Addresses

You can restrict access to a specific set of IP addresses:

```js
app.use(
  ipGuard({
    allowedIPs: [
      "192.168.1.10",
      "192.168.1.20"
    ]
  })
);
```

When `allowedIPs` is provided, requests from IP addresses that are not in the list are rejected.

### Combining Blocklist and Allowlist

Both options can be provided:

```js
app.use(
  ipGuard({
    blockedIPs: ["192.168.1.100"],
    allowedIPs: ["192.168.1.10", "192.168.1.20"]
  })
);
```

### Response When Access Is Denied

Rejected requests receive:

```http
403 Forbidden
```

with:

```json
{
  "error": "Forbidden"
}
```

---

## 5. Request Size Limiter

The `requestSize()` middleware limits the maximum request size based on the `Content-Length` request header.

### Basic Usage

```js
app.use(requestSize());
```

The default limit is:

```text
1 MB
```

### Custom Limit

```js
app.use(
  requestSize({
    limit: 1024 * 1024
  })
);
```

The above configuration allows requests up to 1 MB.

For a 5 MB limit:

```js
app.use(
  requestSize({
    limit: 5 * 1024 * 1024
  })
);
```

### Response When Limit Is Exceeded

The middleware returns:

```http
413 Payload Too Large
```

with:

```json
{
  "error": "Payload too large"
}
```

### Options

| Option  | Type   |   Default | Description                           |
| ------- | ------ | --------: | ------------------------------------- |
| `limit` | Number | `1048576` | Maximum allowed request size in bytes |

---

## 6. Security Logger

The `securityLogger()` middleware records security-related responses.

### Usage

```js
app.use(securityLogger());
```

It currently monitors the following status codes:

| Status | Event               |
| -----: | ------------------- |
|  `403` | Blocked request     |
|  `413` | Payload too large   |
|  `429` | Rate limit exceeded |

Example output:

```text
[SECURITY] BLOCKED_REQUEST - 192.168.1.10
[SECURITY] PAYLOAD_TOO_LARGE - 192.168.1.20
[SECURITY] RATE_LIMIT_EXCEEDED - 192.168.1.30
```

### Custom Logger

You can provide your own logging function:

```js
app.use(
  securityLogger({
    logger: (message) => {
      console.log(message);
    }
  })
);
```

This allows applications to integrate the security events with their own logging or monitoring systems.

---

# Complete Example

The following example combines all available middleware:

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

## Recommended Middleware Order

A recommended setup is:

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

This allows requests to receive an ID early and allows protection middleware to reject unwanted requests before they reach application routes.

## Handling Protected Responses

Your application can continue using normal Express routes:

```js
app.get("/api/data", (req, res) => {
  res.json({
    success: true,
    requestId: req.requestId
  });
});
```

The security middleware operates independently of your application logic.

## Combining Individual Middleware

You do not need to use every middleware.

For example, a minimal setup can use only request IDs and security headers:

```js
app.use(requestId());
app.use(securityHeaders());
```

Or an API focused primarily on rate limiting can use:

```js
app.use(rateLimiter());
```

Choose the middleware based on the requirements of your application.
