const requests = new Map(); /// MAP REMAIN ALIVE WHEN NODE PROCESS IS RUNNING BECAUSE IT IS A MODULE LEVEL STATE
/// WE ARE MAINTAINING MAP FOR : IP address → request information
/// WHEN REQUEST COMES IN
///Request
//    ↓
// Find IP
//    ↓
// Have we seen this IP?
//    ↓
//  ┌───────────────┐
//  │               │
// No              Yes
//  │               │
// Create          Check window
// entry            │
//  │          ┌────┴────┐
//  ↓          ↓         ↓
// Allow    expired    active
//              │         │
//              ↓         ↓
//            reset    increment
//                        │
//                   count > max?
//                     /      \
//                   No        Yes
//                   ↓          ↓
//                 Allow      429

export function rateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000;  //THIS WILL GIVE SENSIBLE DEFAULT
  const max = options.max || 100;

  return (req, res, next) => {
    const ip = req.ip;

    const currentTime = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, {
        count: 1,
        startTime: currentTime
      });

      return next();
    }

    const data = requests.get(ip);

    if (currentTime - data.startTime >= windowMs) {
      data.count = 1;
      data.startTime = currentTime;

      return next();
    }

    data.count++;

    if (data.count > max) {
      return res.status(429).json({
        error: "Too many requests"
      });
    }

    next();
  };
}

// rateLimiter({
//   windowMs: 10000,
//   max: 3
// });   /// IT MEANS windowMs = 10000 → 10 seconds
            // max = 3 → maximum 3 requests per 10 seconds