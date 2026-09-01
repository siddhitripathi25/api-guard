/// HAR API REQUEST KE LIYE UNIQUE ID GENERATE KARVANE KE LIYE
import crypto from "crypto";

export function requestId() {
  return (req, res, next) => {
    const id = crypto.randomUUID();   /// UUID - Universally Unique Identifier...THIS METHOD GEnerates UUID

    req.requestId = id;
    res.setHeader("X-Request-ID", id);

    next();
  }
};