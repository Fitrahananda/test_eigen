exports.ErrorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  if (err.response) {
    status = err.response.status ? err.response.status : 500;
    message = err.response.data.message;
  }
  return res.status(status).json({ status, message });
};
