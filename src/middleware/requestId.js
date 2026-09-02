/// HAR API REQUEST KE LIYE UNIQUE ID GENERATE KARVANE KE LIYE
//requestId()
  //  │
  //  ├── 1. Generates an ID
  //  │
  //  ├── 2. Stores ID in req.requestId
  //  │
  //  ├── 3. Adds X-Request-ID header
  //  │
  //  └── 4. Calls next()
  
import crypto from "crypto";

export function requestId() {
  return (req, res, next) => {
    const id = crypto.randomUUID();   /// UUID - Universally Unique Identifier...THIS METHOD GEnerates UUID

    req.requestId = id;
    res.setHeader("X-Request-ID", id);

    next();
  }
};

