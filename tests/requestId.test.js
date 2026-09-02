/// WE WILL USE VITEST TO VERIFY AND TEST OUR CODE AND FUNCTIONS...VITEST IS MADE ON VITE FOR TESTING AND IT IS VERY LIGHTWEIGHT
/// UNIT TESTING - MAKING fake version and testing middleware independently

import { describe, it, expect } from "vitest";
// describe - Groups related tests.These tests are about requestId.
// it - Defines one specific test.This test checks that requestId generates an ID
// expect - Checks whether something is what we expect.

import { requestId } from "../src/middleware/requestId.js";
describe("requestId middleware", () => {
  it("should generate a request ID", () => {
    const req = {};  // IN THIS WE ARE CREATING A FAKE EXPRESS REQUEST
    const res = {
      setHeader: () => {}   //THIS IS FAKE RESPONSE
    };
    const next = () => {};

    const middleware = requestId();

    middleware(req, res, next);

    expect(req.requestId).toBeDefined(); /// THIS CHECKS THAT DOES REQUEST ID EXISTS OR NOT
  });
  // ====== GENERATE ID IS TESTED HERE =======
  it("should set the X-Request-ID response header", () => {
    let headerName;
    let headerValue;

    const req = {};

    const res = {
      setHeader: (name, value) => {
        headerName = name;
        headerValue = value;
      }
    };

    const next = () => {};

    const middleware = requestId();

    middleware(req, res, next);

    expect(headerName).toBe("X-Request-ID");
    expect(headerValue).toBe(req.requestId);
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

    const middleware = requestId();

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
  });
  //=====MIDDLEWARE IS TESTED HERE======

});



