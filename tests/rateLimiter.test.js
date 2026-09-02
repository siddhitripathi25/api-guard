import { describe, it, expect, vi } from "vitest";
import { rateLimiter } from "../src/middleware/rateLimiter.js";


describe("rateLimiter middleware", () => {

  it("should allow requests under the limit", () => {

    const req = {
      ip: "127.0.0.1"
    };

    const res = {};

    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    const middleware = rateLimiter({
      windowMs: 10000,
      max: 3
    });

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
  });


  it("should block requests over the limit", () => {

    const req = {
      ip: "127.0.0.2"
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

    const middleware = rateLimiter({
      windowMs: 10000,
      max: 2
    });

    middleware(req, res, next);
    middleware(req, res, next);
    middleware(req, res, next);

    expect(statusCode).toBe(429);
  });

  it("should allow requests again after the window expires", () => {

  vi.useFakeTimers();

  const req = {
    ip: "127.0.0.3"
  };

  let nextCalled = false;

  const res = {};

  const next = () => {
    nextCalled = true;
  };

  const middleware = rateLimiter({
    windowMs: 10000,
    max: 1
  });

  // First request
  middleware(req, res, next);

  expect(nextCalled).toBe(true);

  // Reset the variable
  nextCalled = false;

  // Move time forward by 10 seconds
  vi.advanceTimersByTime(10000);  /// THIS TELLS VITEST - Pretend that 10 seconds have passed.

  // Second request after window expired
  middleware(req, res, next);

  expect(nextCalled).toBe(true);

  vi.useRealTimers();
});

});