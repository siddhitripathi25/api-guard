import { describe, it, expect } from "vitest";
import { ipGuard } from "../src/middleware/ipGuard.js";

describe("ipGuard middleware", () => {

  it("should block a blocked IP", () => {

    const req = {
      ip: "192.168.1.100"
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

    const middleware = ipGuard({
      blockedIPs: ["192.168.1.100"]
    });

    middleware(req, res, next);

    expect(statusCode).toBe(403);
  });


  it("should allow an IP that is not blocked", () => {

    const req = {
      ip: "192.168.1.50"
    };

    const res = {};

    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    const middleware = ipGuard({
      blockedIPs: ["192.168.1.100"]
    });

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
  });


  it("should allow an IP in the allowlist", () => {

    const req = {
      ip: "192.168.1.10"
    };

    const res = {};

    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    const middleware = ipGuard({
      allowedIPs: ["192.168.1.10", "192.168.1.20"]
    });

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
  });


  it("should block an IP that is not in the allowlist", () => {

    const req = {
      ip: "192.168.1.50"
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

    const middleware = ipGuard({
      allowedIPs: ["192.168.1.10", "192.168.1.20"]
    });

    middleware(req, res, next);

    expect(statusCode).toBe(403);
  });

});