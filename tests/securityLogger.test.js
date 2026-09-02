import { describe, it, expect, vi } from "vitest";
import { securityLogger } from "../src/middleware/securityLogger.js";

describe("securityLogger middleware", () => {
  it("should log blocked requests", () => {
    const logger = vi.fn();

    const req = {
      ip: "192.168.1.10"
    };

    const res = {
      status: vi.fn(function (code) {
        return this;
      })
    };

    const next = vi.fn();

    securityLogger({ logger })(req, res, next);

    res.status(403);

    expect(logger).toHaveBeenCalledWith(
      "[SECURITY] BLOCKED_REQUEST - 192.168.1.10"
    );
  });

  it("should log payload too large errors", () => {
    const logger = vi.fn();

    const req = {
      ip: "192.168.1.20"
    };

    const res = {
      status: vi.fn(function (code) {
        return this;
      })
    };

    const next = vi.fn();

    securityLogger({ logger })(req, res, next);

    res.status(413);

    expect(logger).toHaveBeenCalledWith(
      "[SECURITY] PAYLOAD_TOO_LARGE - 192.168.1.20"
    );
  });

  it("should log rate limit violations", () => {
    const logger = vi.fn();

    const req = {
      ip: "192.168.1.30"
    };

    const res = {
      status: vi.fn(function (code) {
        return this;
      })
    };

    const next = vi.fn();

    securityLogger({ logger })(req, res, next);

    res.status(429);

    expect(logger).toHaveBeenCalledWith(
      "[SECURITY] RATE_LIMIT_EXCEEDED - 192.168.1.30"
    );
  });

  it("should call next()", () => {
    const req = {
      ip: "192.168.1.40"
    };

    const res = {
      status: vi.fn(function (code) {
        return this;
      })
    };

    const next = vi.fn();

    securityLogger({
      logger: vi.fn()
    })(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});