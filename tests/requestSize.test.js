import { describe, it, expect } from "vitest";
import { requestSize } from "../src/middleware/requestSize.js";

describe("requestSize middleware", () => {
  it("should allow requests under the limit", () => {
    const req = {
      headers: {
        "content-length": "500"
      }
    };

    const res = {};
    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    requestSize({ limit: 1000 })(req, res, next);

    expect(nextCalled).toBe(true);
  });

  it("should reject requests over the limit", () => {
    const req = {
      headers: {
        "content-length": "1500"
      }
    };

    let statusCode;
    let jsonResponse;

    const res = {
      status: (code) => {
        statusCode = code;

        return {
          json: (data) => {
            jsonResponse = data;
          }
        };
      }
    };

    const next = () => {};

    requestSize({ limit: 1000 })(req, res, next);

    expect(statusCode).toBe(413);
    expect(jsonResponse).toEqual({
      error: "Payload too large"
    });
  });

  it("should allow requests when Content-Length is missing", () => {
    const req = {
      headers: {}
    };

    const res = {};
    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    requestSize({ limit: 1000 })(req, res, next);

    expect(nextCalled).toBe(true);
  });

  it("should use 1 MB as the default limit", () => {
    const req = {
      headers: {
        "content-length": String(1024 * 1024 + 1)
      }
    };

    let statusCode;

    const res = {
      status: (code) => {
        statusCode = code;

        return {
          json: () => {}
        };
      }
    };

    const next = () => {};

    requestSize()(req, res, next);

    expect(statusCode).toBe(413);
  });
});