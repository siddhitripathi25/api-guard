// // WHY THIS IS USEFUL 
// Imagine your API receives:
// 1000 requests
//    ↓
// 950 normal
//    ↓
// 30 rate-limit violations
//    ↓
// 15 blocked IP attempts
//    ↓
// 5 oversized requests
// Without logging, you only know that those requests were rejected.

// With security logging, you can actually see:

// RATE_LIMIT_EXCEEDED
// BLOCKED_IP
// PAYLOAD_TOO_LARGE
// This is useful for debugging, monitoring, incident investigation, and security analysis.

export function securityLogger(options = {}) {
  const logger = options.logger || console.log;

  return (req, res, next) => {
    const originalStatus = res.status;

    res.status = function (code) {
      if (code === 403) {
        logger(`[SECURITY] BLOCKED_REQUEST - ${req.ip}`);
      }

      if (code === 413) {
        logger(`[SECURITY] PAYLOAD_TOO_LARGE - ${req.ip}`);
      }

      if (code === 429) {
        logger(`[SECURITY] RATE_LIMIT_EXCEEDED - ${req.ip}`);
      }

      return originalStatus.call(this, code);
    };

    next();
  };
}