import { describe, it, expect } from "vitest";
import { securityHeaders } from "../src/middleware/securityHeaders.js";

describe("securityHeaders middleware", () => {

  it("should set X-Content-Type-Options header", () => {

  const headers = {};

  const req = {};

  const res = {
    setHeader: (name, value) => {
      headers[name] = value;
    }
  };

  const next = () => {};

  const middleware = securityHeaders();

  middleware(req, res, next);

  expect(headers["X-Content-Type-Options"]).toBe("nosniff");
});


  it("should set X-Frame-Options header", () => {

    const headers = {};

    const req = {};

    const res = {
      setHeader: (name, value) => {
        headers[name] = value;
      }
    };

    const next = () => {};

    const middleware = securityHeaders();

    middleware(req, res, next);

    expect(headers["X-Frame-Options"]).toBe("DENY");
  });


  it("should set Referrer-Policy header", () => {

    const headers = {};

    const req = {};

    const res = {
      setHeader: (name, value) => {
        headers[name] = value;
      }
    };

    const next = () => {};

    const middleware = securityHeaders();

    middleware(req, res, next);

    expect(headers["Referrer-Policy"]).toBe("no-referrer");
  });


  it("should call next middleware", () => {

    const req = {};

    const res = {
      setHeader: () => {}
    };

    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    const middleware = securityHeaders();

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
  });

});