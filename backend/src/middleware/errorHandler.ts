export const errorHandler = (err, req, res, next) => {
  const time = new Date().toISOString();

  console.error(`[${time}] ERROR:`, err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
