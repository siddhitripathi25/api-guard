export function ipGuard(options = {}) {
  const blockedIPs = options.blockedIPs || [];
  const allowedIPs = options.allowedIPs || [];

  return (req, res, next) => {
    const ip = req.ip;

    if (blockedIPs.includes(ip)) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    if (allowedIPs.length > 0 && !allowedIPs.includes(ip)) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    next();
  };
}
// ===== BLOCKLIST ===== - Everyone can access the API except this IP.
// FLOW: Request
//    ↓
// Get IP
//    ↓
// Is IP blocked?
//    │
//  ┌─┴─────┐
// Yes      No
//  ↓        ↓
// 403     Allow


/// ======= ALLOW LIST ====== - Only these IPs are allowed.
// FLOW: Request
//    ↓
// Get IP
//    ↓
// Is allowlist empty?
//    │
//  ┌─┴────────┐
// Yes         No
//  │           │
// Allow     Is IP allowed?
//              │
//           ┌──┴───┐
//          Yes     No
//           ↓       ↓
//         Allow    403