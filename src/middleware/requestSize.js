export function requestSize(options = {}) {
  const limit = options.limit || 1024 * 1024; // 1 MB

  return (req, res, next) => {
    const contentLength = req.headers["content-length"];

    if (contentLength && Number(contentLength) > limit) {
      return res.status(413).json({
        error: "Payload too large"
      });
    }

    next();
  };
}