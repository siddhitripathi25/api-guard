// SECURITY HEADERS - When server sends a response, it sends: BODY AND HEADER
// EX- HTTP/1.1 200 OK
// Content-Type: application/json
//Security headers add browser instructions that can reduce certain common web risks.

export function securityHeaders() {
  return (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff"); // THIS TELLS BROWSER - Do not guess the content type. Follow the declared Content-Type.

    res.setHeader("X-Frame-Options", "DENY"); // THIS TELLS BROWSER - Do not allow this page to be embedded inside an iframe.

    res.setHeader("Referrer-Policy", "no-referrer"); // THIS TELLS BROWSER - When a user navigates from your site to another site, browsers may send referrer information.

    next();
  };
}