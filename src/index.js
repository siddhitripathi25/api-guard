import crypto from "crypto";

export function requestId() {
  return (req, res, next) => {
    const id = crypto.randomUUID();

    req.requestId = id;
    res.setHeader("X-Request-ID", id);

    next();
  };
}